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
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { productApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/error";
import type { Product } from "@/types/api.types";

const emptyForm = { name: "", price: "", stock: "" };
type ProductSortKey = "name" | "price" | "stock" | "sku";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    price?: string;
    stock?: string;
  }>({});
  const [sortBy, setSortBy] = useState<ProductSortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.list();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFieldErrors({});
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
    setFieldErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const nextErrors: { name?: string; price?: string; stock?: string } = {};
    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = "Price must be greater than 0";
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      nextErrors.stock = "Stock must be 0 or more";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editing) {
        await productApi.update(editing.id, payload);
      } else {
        await productApi.create(payload);
      }
      setDialogOpen(false);
      await loadProducts();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save product"));
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await productApi.remove(productId);
      await loadProducts();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete product"));
    }
  };

  const handleSort = (key: ProductSortKey) => {
    setSortDirection((prev) =>
      sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc",
    );
    setSortBy(key);
  };

  const sortedProducts = useMemo(() => {
    const data = [...products];
    const direction = sortDirection === "asc" ? 1 : -1;
    const getValue = (product: Product) => {
      switch (sortBy) {
        case "name":
          return product.name;
        case "price":
          return product.price;
        case "stock":
          return product.stock;
        case "sku":
          return product.id;
        default:
          return product.name;
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
  }, [products, sortBy, sortDirection]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={800}>
          Products
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Create Product
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
            <Typography color="text.secondary">Loading products...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={sortBy === "name" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "name"}
                      direction={sortBy === "name" ? sortDirection : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={sortBy === "price" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "price"}
                      direction={sortBy === "price" ? sortDirection : "asc"}
                      onClick={() => handleSort("price")}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={sortBy === "stock" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "stock"}
                      direction={sortBy === "stock" ? sortDirection : "asc"}
                      onClick={() => handleSort("stock")}
                    >
                      Stock
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sortDirection={sortBy === "sku" ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === "sku"}
                      direction={sortBy === "sku" ? sortDirection : "asc"}
                      onClick={() => handleSort("sku")}
                    >
                      SKU
                    </TableSortLabel>
                  </TableCell>

                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.id.slice(0, 8)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button size="small" onClick={() => openEdit(product)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product.id)}
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
        <DialogTitle>{editing ? "Edit Product" : "Create Product"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              required
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              fullWidth
              required
              error={Boolean(fieldErrors.price)}
              helperText={fieldErrors.price}
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              fullWidth
              required
              error={Boolean(fieldErrors.stock)}
              helperText={fieldErrors.stock}
            />
            <TextField
              label="SKU"
              value={editing ? editing.id : "Auto-generated"}
              fullWidth
              InputProps={{ readOnly: true }}
              helperText="Generated automatically when saved."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
