package com.swayamcraft.dto;

import com.swayamcraft.model.Order;
import com.swayamcraft.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardReportDto {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long pendingOrders;
    private long craftingOrders;
    private long deliveredOrders;
    private long totalProducts;
    private long lowStockCount;

    private List<Product> lowStockProducts;
    private List<Order> recentOrders;
    private Map<String, Long> categoryProductCounts;
    private Map<String, Long> orderStatusCounts;
}
