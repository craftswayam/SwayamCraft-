package com.swayamcraft.dto;

import com.swayamcraft.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    private String postalCode;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String giftNoteCard;

    private Boolean giftWrap = false;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    // Optional list of items from local client cart if transferring directly
    private List<CartItemRequest> clientItems;
}
