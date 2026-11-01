package com.siwms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDTO {

    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private Long userId;
        private String name;
        private String email;
        private String role;
        private Long warehouseId;
        private String warehouseName;

        public LoginResponse() {}

        public LoginResponse(String accessToken, String refreshToken, String tokenType, Long userId, String name, String email, String role, Long warehouseId, String warehouseName) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            if (tokenType != null) this.tokenType = tokenType;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
            this.warehouseId = warehouseId;
            this.warehouseName = warehouseName;
        }

        public String getAccessToken() { return accessToken; }
        public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public String getWarehouseName() { return warehouseName; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String accessToken;
            private String refreshToken;
            private String tokenType = "Bearer";
            private Long userId;
            private String name;
            private String email;
            private String role;
            private Long warehouseId;
            private String warehouseName;

            public Builder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
            public Builder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
            public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
            public Builder userId(Long userId) { this.userId = userId; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder role(String role) { this.role = role; return this; }
            public Builder warehouseId(Long warehouseId) { this.warehouseId = warehouseId; return this; }
            public Builder warehouseName(String warehouseName) { this.warehouseName = warehouseName; return this; }

            public LoginResponse build() {
                return new LoginResponse(accessToken, refreshToken, tokenType, userId, name, email, role, warehouseId, warehouseName);
            }
        }
    }

    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;

        public RefreshRequest() {}
        public RefreshRequest(String refreshToken) { this.refreshToken = refreshToken; }

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class ChangePasswordRequest {
        @NotBlank private String currentPassword;
        @NotBlank private String newPassword;

        public ChangePasswordRequest() {}
        public ChangePasswordRequest(String currentPassword, String newPassword) {
            this.currentPassword = currentPassword;
            this.newPassword = newPassword;
        }

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
