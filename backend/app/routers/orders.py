from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Order, OrderItem, CartItem, Product, OrderStatus
from app.auth import get_current_user, get_current_admin
from app.schemas import (
    OrderCreate,
    OrderResponse,
    OrderListResponse,
    OrderUpdateStatus,
    DashboardStats,
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderListResponse])
def get_my_orders(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's orders"""
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    
    return orders


@router.get("/admin/orders", response_model=List[OrderListResponse])
def get_all_orders(
    current_user=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all orders (Admin only)"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order details"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user owns this order or is admin
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order from cart"""
    # Get cart items
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    # Calculate total price
    total_price = 0
    for item in cart_items:
        if not item.product.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{item.product.name}' is no longer available"
            )
        total_price += item.product.price * item.quantity
    
    # Create order
    new_order = Order(
        user_id=current_user.id,
        total_price=total_price,
        status=OrderStatus.PENDING,
        delivery_address=order_data.delivery_address,
        phone_number=order_data.phone_number,
        notes=order_data.notes
    )
    
    db.add(new_order)
    db.flush()  # Get the order ID
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        db.add(order_item)
    
    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(new_order)
    
    return new_order


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_data: OrderUpdateStatus,
    current_user=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update order status (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = status_data.status
    db.commit()
    db.refresh(order)
    
    return order


@router.get("/admin/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics (Admin only)"""
    from app.models import User, Product
    
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    
    # Calculate total revenue from delivered orders
    total_revenue = db.query(Order).filter(
        Order.status == OrderStatus.DELIVERED
    ).with_entities(Order.total_price).all()
    total_revenue = sum(price[0] for price in total_revenue) if total_revenue else 0
    
    # Get recent orders
    recent_orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(10).all()
    
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "recent_orders": recent_orders
    }
