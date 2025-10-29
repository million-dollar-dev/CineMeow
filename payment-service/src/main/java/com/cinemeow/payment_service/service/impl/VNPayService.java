package com.cinemeow.payment_service.service.impl;

import com.cinemeow.payment_service.constant.Symbol;
import com.cinemeow.payment_service.constant.VNPayParams;
import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.request.PaymentCallbackRequest;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;
import com.cinemeow.payment_service.enums.Currency;
import com.cinemeow.payment_service.enums.Locale;
import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.exception.AppException;
import com.cinemeow.payment_service.exception.ErrorCode;
import com.cinemeow.payment_service.service.CryptoService;
import com.cinemeow.payment_service.service.PaymentService;
import com.cinemeow.payment_service.util.DateUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@Slf4j
public class VNPayService implements PaymentService {

    public static final String VERSION = "2.1.0";
    public static final String COMMAND = "pay";
    public static final String ORDER_TYPE = "190000";
    public static final long DEFAULT_MULTIPLIER = 100L;


    @Value("${payment.vnpay.tmn-code}")
    @NonFinal
    String tmnCode;

    @Value("${payment.vnpay.init-payment-url}")
    @NonFinal
    String initPaymentPrefixUrl;

    @Value("${payment.return-url}")
    @NonFinal
    String returnUrlFormat;

    @Value("${payment.vnpay.timeout}")
    @NonFinal
    Integer paymentTimeout;

    CryptoService cryptoService;

    @Override
    public InitPaymentResponse createPayment(InitPaymentRequest request) {
        var amount = request.getAmount().longValueExact() * DEFAULT_MULTIPLIER;  // 1. amount * 100
        var txnRef = request.getBookingId() + "-" + (System.currentTimeMillis() % 100000);                      // 2. bookingId
        var returnUrl = buildReturnUrl(txnRef);                 // 3. FE redirect by returnUrl
        var vnCalendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        var createdDate = DateUtil.formatVnPayVnTime(vnCalendar);
        vnCalendar.add(Calendar.MINUTE, paymentTimeout);
        var expiredDate = DateUtil.formatVnPayVnTime(vnCalendar);    // 4. expiredDate for secure

        var ipAddress = request.getIpAddress();
        var orderInfo = buildPaymentDetail(request);

        Map<String, String> params = new HashMap<>();

        params.put(VNPayParams.VERSION, VERSION);
        params.put(VNPayParams.COMMAND, COMMAND);

        params.put(VNPayParams.TMN_CODE, tmnCode);
        params.put(VNPayParams.AMOUNT, String.valueOf(amount));
        params.put(VNPayParams.CURRENCY, Currency.VND.getValue());

        params.put(VNPayParams.TXN_REF, txnRef);
        params.put(VNPayParams.RETURN_URL, returnUrl);

        params.put(VNPayParams.CREATED_DATE, createdDate);
        params.put(VNPayParams.EXPIRE_DATE, expiredDate);

        params.put(VNPayParams.IP_ADDRESS, ipAddress);
        params.put(VNPayParams.LOCALE, Locale.VIETNAM.getCode());

        params.put(VNPayParams.ORDER_INFO, orderInfo);
        params.put(VNPayParams.ORDER_TYPE, ORDER_TYPE);

        var initPaymentUrl = buildInitPaymentUrl(params);

        return InitPaymentResponse.builder()
                .paymentUrl(initPaymentUrl)
                .gateway("VNPAY")
                .build();
    }

    @Override
    public PaymentCallbackResponse handleCallback(Map<String, String> params) {
        if (!verifyIpn(params)) {
            throw new AppException(ErrorCode.VNPAY_SIGNING_FAILED);
        }

        String txnRef = params.get(VNPayParams.TXN_REF);
        if (txnRef == null) throw new AppException(ErrorCode.INVALID_PAYMENT_REQUEST);

        String bookingId = extractBookingId(txnRef);
        String responseCode = params.get("vnp_ResponseCode");

        boolean success = "00".equals(responseCode);

        return PaymentCallbackResponse.builder()
                .paymentMethod(PaymentMethod.VNPAY)
                .bookingId(bookingId)
                .success(success)
                .message(success ? "Payment success" : "Payment failed: " + responseCode)
                .build();
    }


    private String buildPaymentDetail(InitPaymentRequest request) {
        return String.format("Thanh toan ve xem phim ma booking: %s", request.getBookingId());
    }

    private String buildReturnUrl(String txnRef) {
        return String.format(returnUrlFormat, txnRef);
    }

    public boolean verifyIpn(Map<String, String> params) {
        var reqSecureHash = params.get(VNPayParams.SECURE_HASH);
        params.remove(VNPayParams.SECURE_HASH);
        params.remove(VNPayParams.SECURE_HASH_TYPE);
        var hashPayload = new StringBuilder();
        var fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        var itr = fieldNames.iterator();
        while (itr.hasNext()) {
            var fieldName = itr.next();
            var fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                //Build hash data
                hashPayload.append(fieldName);
                hashPayload.append(Symbol.EQUAL);
                hashPayload.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    hashPayload.append(Symbol.AND);
                }
            }
        }

        var secureHash = cryptoService.sign(hashPayload.toString());
        return secureHash.equals(reqSecureHash);
    }

    @SneakyThrows
    private String buildInitPaymentUrl(Map<String, String> params) {
        var hashPayload = new StringBuilder();
        var query = new StringBuilder();
        var fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);   // 1. Sort field names

        var itr = fieldNames.iterator();
        while (itr.hasNext()) {
            var fieldName = itr.next();
            var fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                // 2.1. Build hash data
                hashPayload.append(fieldName);
                hashPayload.append(Symbol.EQUAL);
                hashPayload.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // 2.2. Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append(Symbol.EQUAL);
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    query.append(Symbol.AND);
                    hashPayload.append(Symbol.AND);
                }
            }
        }

        // 3. Build secureHash
        var secureHash = cryptoService.sign(hashPayload.toString());

        // 4. Finalize query
        query.append("&vnp_SecureHash=");
        query.append(secureHash);

        return initPaymentPrefixUrl + "?" + query;
    }

    private String extractBookingId(String txnRef) {
        String[] parts = txnRef.split("-");
        if (parts.length >= 2) {
            return parts[0];
        }
        throw new AppException(ErrorCode.VNPAY_SIGNING_FAILED);
    }

}
