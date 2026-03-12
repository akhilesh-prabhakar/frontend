"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { orderApi, productApi } from "@/lib/api";
import type { Order, Product } from "@/types/api.types";

type StatusBucket = { label: string; count: number };

const statusOrder = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

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

    return {
      totalProducts,
      totalOrders,
      totalStock,
      totalRevenue,
      statusBuckets,
    };
  }, [products, orders]);

  const lowStock = useMemo(
    () => [...products].sort((a, b) => a.stock - b.stock).slice(0, 4),
    [products],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const statusTone = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "#f97316", label: "Pending" };
      case "CONFIRMED":
        return { color: "#0ea5e9", label: "Confirmed" };
      case "SHIPPED":
        return { color: "#14b8a6", label: "Shipped" };
      case "DELIVERED":
        return { color: "#22c55e", label: "Delivered" };
      case "CANCELLED":
        return { color: "#ef4444", label: "Cancelled" };
      default:
        return { color: "#64748b", label: status };
    }
  };

  return (
    <Box>
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 4,
          border: "1px solid rgba(148, 163, 184, 0.35)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 60%, rgba(15, 23, 42, 0.98) 100%)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Operations Dashboard
                </Typography>
                <Typography variant="body2" color="rgba(226,232,240,0.8)">
                  Live overview of inventory, orders, and fulfillment signals.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button
                  component={Link}
                  href="/products"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  View Products
                </Button>
                <Button
                  component={Link}
                  href="/orders"
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "#14b8a6",
                    "&:hover": { bgcolor: "#0f766e" },
                  }}
                >
                  Review Orders
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {["Realtime sync", "Role-based access", "Audit trails"].map(
                (tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.35)",
                    }}
                    variant="outlined"
                  />
                ),
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Products",
            value: analytics.totalProducts,
            icon: Inventory2OutlinedIcon,
          },
          {
            label: "Total Orders",
            value: analytics.totalOrders,
            icon: ReceiptLongOutlinedIcon,
          },
          {
            label: "Inventory Units",
            value: analytics.totalStock,
            icon: ShoppingCartOutlinedIcon,
          },
          {
            label: "Revenue",
            value: currency.format(analytics.totalRevenue),
            icon: PaidOutlinedIcon,
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={metric.label}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "rgba(15, 118, 110, 0.12)",
                        display: "grid",
                        placeItems: "center",
                        color: "primary.main",
                      }}
                    >
                      <Icon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {loading ? "--" : metric.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.35)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Orders by Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                A quick snapshot of the pipeline.
              </Typography>

              <Stack spacing={1.5}>
                {analytics.statusBuckets.map((bucket) => {
                  const max = Math.max(
                    ...analytics.statusBuckets.map((b) => b.count),
                    1,
                  );
                  const width = (bucket.count / max) * 100;
                  const tone = statusTone(bucket.label);
                  return (
                    <Box key={bucket.label}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: tone.color,
                            }}
                          />
                          <Typography variant="body2">{tone.label}</Typography>
                        </Stack>
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
                            bgcolor: tone.color,
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
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.35)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Low stock spotlight
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Products nearing their threshold.
              </Typography>
              <Stack spacing={2}>
                {loading && <Typography variant="body2">Loading...</Typography>}
                {!loading && lowStock.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No products available.
                  </Typography>
                )}
                {!loading &&
                  lowStock.map((product) => (
                    <Stack
                      key={product.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{ wordBreak: "break-word" }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ wordBreak: "break-word" }}
                        >
                          SKU: #{product.id.substring(0, 8)}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${product.stock} in stock`}
                        size="small"
                        sx={{
                          bgcolor:
                            product.stock < 10
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(249, 115, 22, 0.15)",
                          color: product.stock < 10 ? "#ef4444" : "#f97316",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.35)",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Recent orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Most recent activity across all services.
                  </Typography>
                </Box>
                <Button component={Link} href="/orders" size="small">
                  View all
                </Button>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {loading && <Typography variant="body2">Loading...</Typography>}
                {!loading && recentOrders.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No orders yet.
                  </Typography>
                )}
                {!loading &&
                  recentOrders.slice(0, 3).map((order) => {
                    const tone = statusTone(order.status);
                    return (
                      <Stack
                        key={order.id}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{ wordBreak: "break-word" }}
                          >
                            Order ID #{order.id.slice(0, 8)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ wordBreak: "break-word" }}
                          >
                            Product ID #{order.productId.slice(0, 8)} · Qty{" "}
                            {order.quantity}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="subtitle2" fontWeight={700}>
                            {currency.format(order.totalPrice)}
                          </Typography>
                          <Chip
                            label={tone.label}
                            size="small"
                            sx={{
                              bgcolor: `${tone.color}22`,
                              color: tone.color,
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Stack>
                    );
                  })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
