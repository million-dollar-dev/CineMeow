package com.cinemeow.booking_service.service.impl;

import com.cinemeow.booking_service.dto.response.BookingDetailResponse;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.repository.BookingRepository;
import com.cinemeow.booking_service.service.BookingService;
import com.cinemeow.booking_service.service.QrService;
import io.jsonwebtoken.JwtException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class QrServiceImpl implements QrService {

    @NonFinal
    @Value("${app.qr.secret-key}")
    String secretKey;

    @NonFinal
    @Value("${app.qr.verify-url}")
    String verifyUrl;

    BookingService bookingService;

    @Override
    public String generateQRCode(String bookingId) {
        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(bookingId)
                .setIssuedAt(Date.from(now))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String generateQrImage(String qrToken) {
        try {
            String data = verifyUrl + qrToken;

            int size = 250;
            var qrWriter = new com.google.zxing.qrcode.QRCodeWriter();
            var bitMatrix = qrWriter.encode(data, com.google.zxing.BarcodeFormat.QR_CODE, size, size);

            BufferedImage qrImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < size; x++) {
                for (int y = 0; y < size; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            return "data:image/png;base64," + base64;
        } catch (Exception e) {
            throw new AppException(ErrorCode.QR_GENERATION_FAILED);
        }
    }

    @Override
    public BookingDetailResponse verifyQRCode(String token) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String bookingId = claims.getSubject();
            return bookingService.getById(bookingId);
        } catch (JwtException e) {
            throw new AppException(ErrorCode.QR_INVALID);
        }
    }
}
