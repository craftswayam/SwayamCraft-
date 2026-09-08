package com.swayamcraft.service;

import com.swayamcraft.model.PaymentMethod;
import com.swayamcraft.model.PaymentRecord;
import com.swayamcraft.model.PaymentStatus;
import com.swayamcraft.repository.PaymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRecordRepository paymentRecordRepository;

    @Transactional
    public PaymentRecord processPayment(String orderNumber, BigDecimal amount, PaymentMethod method) {
        String transactionRef = "SWY-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        PaymentStatus status;
        String responseMessage;

        if (method == PaymentMethod.COD) {
            status = PaymentStatus.PENDING;
            responseMessage = "Cash On Delivery order confirmed. Payment will be collected on delivery.";
        } else {
            // Simulated instant confirmation for UPI, Card, NetBanking
            status = PaymentStatus.PAID;
            responseMessage = "Payment successful via " + method + " gateway. Transaction verified.";
        }

        PaymentRecord record = PaymentRecord.builder()
                .orderNumber(orderNumber)
                .transactionReference(transactionRef)
                .paymentMethod(method)
                .status(status)
                .amount(amount)
                .gatewayResponse(responseMessage)
                .paymentTimestamp(LocalDateTime.now())
                .build();

        return paymentRecordRepository.save(record);
    }
}
