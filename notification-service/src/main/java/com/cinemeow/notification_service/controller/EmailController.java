package com.cinemeow.notification_service.controller;

import com.cinemeow.notification_service.dto.request.SendMailRequest;
import com.cinemeow.notification_service.dto.response.BaseResponse;
import com.cinemeow.notification_service.dto.response.EmailResponse;
import com.cinemeow.notification_service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("/email/send")
    public BaseResponse<EmailResponse> sendMail(@RequestBody SendMailRequest request) {
        log.info("[Email data]: {}", request.getData());
//        Map<String, Object> data =  new HashMap<>();
//        data.put("verificationUrl", "http://localhost:5174/verify-account?token=123");
//        data.put("subject", request.getSubject());
//        data.put("movieTitle", "Deadpood 2");
//        data.put("cinemaName", "Deadpood 2");
//        data.put("roomName", "Deadpood 2");
//        data.put("startTime", "Deadpood 2");
//        data.put("seats", "A1");
//        data.put("totalPrice", "1111111");
//        data.put("posterPath", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP10jfogo1k0th2yRURa44JHr9ePPrp__-tw&s");
//        request.setData(data);

        return BaseResponse.<EmailResponse>builder()
                .data(emailService.sendMail(request))
                .build();
    }
}
