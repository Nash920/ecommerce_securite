import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .subscribe((data) => (this.products = data));
  }
}
