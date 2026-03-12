"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { orderApi, productApi } from "@/lib/api";
import type { Order, Product } from "@/types/api.types";

type StatusBucket = { label: string; count: number };

const statusOrder = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [productData, orderData] = await Promise.all([
          productApi.list(),
          orderApi.list(),
        ]);
        setProducts(productData);
        setOrders(orderData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const statusMap = new Map<string, number>();
    orders.forEach((o) => {
      statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
    });

    const statusBuckets: StatusBucket[] = statusOrder.map((label) => ({
      label,
      count: statusMap.get(label) ?? 0,
    }));

    return { totalProducts, totalOrders, totalStock, totalRevenue, statusBuckets };
  }, [products, orders]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Live overview of inventory and order activity.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Products", value: analytics.totalProducts },
          { label: "Total Orders", value: analytics.totalOrders },
          { label: "Inventory Units", value: analytics.totalStock },
          {
            label: "Revenue",
            value: `$${analytics.totalRevenue.toFixed(2)}`,
          },
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {loading ? "—" : metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Orders by Status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A quick snapshot of the pipeline.
          </Typography>

          <Stack spacing={1.5}>
            {analytics.statusBuckets.map((bucket) => {
              const max = Math.max(...analytics.statusBuckets.map((b) => b.count), 1);
              const width = (bucket.count / max) * 100;
              return (
                <Box key={bucket.label}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{bucket.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bucket.count}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "grey.200",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${width}%`,
                        bgcolor: "primary.main",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
