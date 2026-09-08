package com.swayamcraft.dto;

import com.swayamcraft.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private Set<Role> roles;
}
