package com.swayamcraft.repository;

import com.swayamcraft.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    Optional<PaymentRecord> findByTransactionReference(String transactionReference);
    Optional<PaymentRecord> findByOrderNumber(String orderNumber);
}
