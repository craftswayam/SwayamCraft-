package com.swayamcraft.controller;

import com.swayamcraft.dto.DashboardReportDto;
import com.swayamcraft.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
@RequiredArgsConstructor
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardReportDto> getDashboardMetrics() {
        return ResponseEntity.ok(reportService.getDashboardMetrics());
    }
}
