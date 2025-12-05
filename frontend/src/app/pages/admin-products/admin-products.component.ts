import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  apiUrl = 'http://localhost:3000/api';
  products: Product[] = [];

  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;

  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .subscribe((data) => (this.products = data));
  }

  createProduct() {
    this.error = '';

    const body = {
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock
    };

    this.http
      .post<Product>(`${this.apiUrl}/admin/products`, body)
      .subscribe({
        next: (p) => {
          this.products.unshift(p);
          this.name = '';
          this.description = '';
          this.price = null;
          this.stock = null;
        },
        error: (err) => {
          this.error =
            err.error?.message ||
            'Erreur lors de la création du produit.';
        }
      });
  }

  deleteProduct(id: number) {
    this.http
      .delete(`${this.apiUrl}/admin/products/${id}`)
      .subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
  }
}
