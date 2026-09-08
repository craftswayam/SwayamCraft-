package com.swayamcraft.dto;

import com.swayamcraft.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private OrderStatus status;

    private String trackingNumber;
}
