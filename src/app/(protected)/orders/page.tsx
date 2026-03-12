"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { orderApi, productApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/error";
import type { Order, Product } from "@/types/api.types";

const emptyForm = { productId: "", quantity: "", status: "PENDING" };
const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
type OrderSortKey = "id" | "productId" | "quantity" | "status" | "totalPrice";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<{
    productId?: string;
    quantity?: string;
  }>({});
  const [sortBy, setSortBy] = useState<OrderSortKey>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.list();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await productApi.list();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFieldErrors({});
    loadProducts();
    setDialogOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setForm({
      productId: order.productId,
      quantity: String(order.quantity),
      status: order.status,
    });
    setFieldErrors({});
    loadProducts();
    setDialogOpen(true);
  };

  const validate = () => {
    const nextErrors: { productId?: string; quantity?: string } = {};
    if (!form.productId) {
      nextErrors.productId = "Product is required";
    }
    if (!form.quantity || Number(form.quantity) < 1) {
      nextErrors.quantity = "Quantity must be at least 1";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const payload = {
      productId: form.productId,
      quantity: Number(form.quantity),
      status: form.status,
    };
    try {
      if (editing) {
        await orderApi.update(editing.id, payload);
      } else {
        await orderApi.create({
          productId: payload.productId,
          quantity: payload.quantity,
        });
      }
      setDialogOpen(false);
      await loadOrders();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save order"));
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await orderApi.remove(orderId);
      await loadOrders();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete order"));
    }
  };

  const handleSort = (key: OrderSortKey) => {
    setSortDirection((prev) =>
      sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc",
    );
    setSortBy(key);
  };

  const sortedOrders = useMemo(() => {
    const data = [...orders];
    const direction = sortDirection === "asc" ? 1 : -1;
    const getValue = (order: Order) => {
      switch (sortBy) {
        case "id":
          return order.id;
        case "productId":
          return order.productId;
        case "quantity":
          return order.quantity;
        case "status":
          return order.status;
        case "totalPrice":
          return order.totalPrice;
        default:
          return order.id;
      }
    };
    return data.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [orders, sortBy, sortDirection]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={800}>
          Orders
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Create Order
        </Button>
      </Stack>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading orders...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={sortBy === "id" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "id"}
                      direction={sortBy === "id" ? sortDirection : "asc"}
                      onClick={() => handleSort("id")}
                    >
                      Order ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sortBy === "productId" ? sortDirection : false
                    }
                  >
                    <TableSortLabel
                      active={sortBy === "productId"}
                      direction={sortBy === "productId" ? sortDirection : "asc"}
                      onClick={() => handleSort("productId")}
                    >
                      Product ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sortBy === "quantity" ? sortDirection : false
                    }
                  >
                    <TableSortLabel
                      active={sortBy === "quantity"}
                      direction={sortBy === "quantity" ? sortDirection : "asc"}
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={sortBy === "status" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "status"}
                      direction={sortBy === "status" ? sortDirection : "asc"}
                      onClick={() => handleSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sortBy === "totalPrice" ? sortDirection : false
                    }
                  >
                    <TableSortLabel
                      active={sortBy === "totalPrice"}
                      direction={
                        sortBy === "totalPrice" ? sortDirection : "asc"
                      }
                      onClick={() => handleSort("totalPrice")}
                    >
                      Total
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.productId}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button size="small" onClick={() => openEdit(order)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Order" : "Create Order"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth error={Boolean(fieldErrors.productId)}>
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                label="Product"
                value={form.productId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    productId: String(e.target.value),
                  }))
                }
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} — ${product.price.toFixed(2)} (stock{" "}
                    {product.stock})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {loadingProducts
                  ? "Loading products..."
                  : products.length === 0
                    ? "Create a product first."
                    : "Choose a product to order."}
                {fieldErrors.productId ? ` ${fieldErrors.productId}` : ""}
              </FormHelperText>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, quantity: e.target.value }))
              }
              fullWidth
              required
              error={Boolean(fieldErrors.quantity)}
              helperText={fieldErrors.quantity}
            />
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: String(e.target.value),
                  }))
                }
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Update the order lifecycle status.
              </FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.productId || Number(form.quantity) < 1}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
