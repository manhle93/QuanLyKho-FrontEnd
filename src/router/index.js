import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index2"),
    hidden: true
  },
  {
    path: "/matkhaumoi/:token",
    component: () => import("@/views/login/matkhaumoi"),
    hidden: true
  },
  {
    path: "/quenmatkhau",
    component: () => import("@/views/login/quenmatkhau"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/tongquan",
    children: [
      {
        path: "tongquan",
        name: "Tổng quan",
        component: () => import("@/views/trungtamchihuy/index"),
        meta: {
          title: "Tổng quan",
          icon: "tongquan"
        }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404_2"),
    hidden: true
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/caidat",
    component: Layout,
    meta: {
      title: "Thiết lập chung",
      icon: "caidat"
    },
    name: "Thiết lập chung",
    children: [
      {
        path: "slider",
        name: "Slider",
        component: () => import("@/views/caidat/slider/index"),
        meta: {
          title: "Slider",
          icon: "slider"
        }
      },
      {
        path: "monngonmoingay",
        name: "Món ngon mỗi ngày",
        component: () => import("@/views/caidat/monngon/index"),
        meta: {
          title: "Món ngon mỗi ngày",
          icon: "monngonmoingay"
        }
      },
      {
        path: "khuyenmai",
        name: "Khuyến mãi",
        component: () => import("@/views/tienich/khuyenmai/index"),
        meta: {
          title: "Khuyến mãi",
          icon: "sale"
        }
      },
      {
        path: "voucher",
        name: "Voucher",
        component: () => import("@/views/tienich/voucher/index"),
        meta: {
          title: "Voucher",
          icon: "voucher"
        }
      }
    ]
  },
  {
    path: "/users",
    component: Layout,
    redirect: "/users/management",
    name: "Người dùng",
    meta: {
      title: "Người dùng",
      icon: "nguoidung"
    },
    children: [
      {
        path: "taikhoan",
        name: "Thông tin tài khoản",
        component: () => import("@/views/user/thongtintaikhoan/index"),
        meta: {
          title: "Thông tin tài khoản",
          icon: "thongtin "
        }
      }
    ]
  },
  {
    path: "/quanlykhuvuc",
    component: Layout,
    meta: {
      title: "Quản lý khu vực",
      icon: "example"
    },
    hidden: true,
    name: "Quản lý khu vực",
    children: [
      {
        path: "tinhthanh",
        name: "Tỉnh thành",
        component: () => import("@/views/danhmuc/tinhthanh/index"),
        meta: {
          title: "Tỉnh thành",
          icon: "table"
        }
      },
      {
        path: "quanhuyen",
        name: "Quận huyện",
        component: () => import("@/views/danhmuc/quanhuyen/index"),
        meta: {
          title: "Quận huyện",
          icon: "table"
        }
      }
    ]
  },
  {
    path: "/quanlykho",
    component: Layout,
    redirect: "/quanlykho",
    name: "Quản lý",
    meta: {
      title: "Quản lý",
      icon: "hanghoa"
    },
    children: [
      {
        path: "loaihanghoa",
        name: "Nhóm hàng hóa",
        component: () => import("@/views/quanlykho/danhmucsanpham/index"),
        meta: {
          title: "Nhóm hàng hóa",
          icon: "danhmuc"
        }
      },
      {
        path: "thietlapgia",
        name: "Thiết lập giá",
        component: () => import("@/views/quanlykho/thietlapgia/index"),
        meta: {
          title: "Thiết lập giá",
          icon: "thietlapgia"
        }
      },

      {
        path: "loaimathang",
        name: "Quản lý hàng hóa",
        component: () => import("@/views/quanlykho/sanpham/index"),
        meta: {
          title: "Quản lý hàng hóa",
          icon: "mathang"
        }
      },
      {
        path: "phieuthu",
        name: "Quản lý phiếu thu",
        component: () => import("@/views/quanlydonhang/phieuthu/index"),
        meta: {
          title: "Quản lý phiếu thu",
          icon: "mathang"
        }
      },
      {
        path: "management",
        name: "Quản lý người dùng",
        component: () => import("@/views/user/index"),
        meta: {
          title: "Quản lý người dùng",
          icon: "quanlynguoidung"
        }
      },
      {
        path: "nhanvien",
        name: "Quản lý nhân viên",
        component: () => import("@/views/user/nhanvien/index"),
        meta: {
          title: "Quản lý nhân viên",
          icon: "quanlynguoidung"
        }
      },
      {
        path: "nhacungcap",
        name: "Nhà cung cấp",
        component: () => import("@/views/doitac/nhacungcap/index"),
        meta: {
          title: "Nhà cung cấp",
          icon: "nhacungcap"
        }
      },
      {
        path: "khachhang",
        name: "Khách hàng",
        component: () => import("@/views/doitac/khachhang/index"),
        meta: {
          title: "Khách hàng",
          icon: "khachhang"
        }
      },
      {
        path: "baogia",
        name: "Báo giá",
        component: () => import("@/views/quanlydonhang/baogia/index"),
        meta: {
          title: "Báo giá",
          icon: "baogia"
        }
      },
      {
        path: "taobaogia",
        name: "Tạo báo giá",
        component: () => import("@/views/quanlydonhang/baogia/taodon"),
        meta: {
          title: "Tạo báo giá",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "capnhatbaogia/:id",
        name: "Cập nhật báo giá",
        component: () => import("@/views/quanlydonhang/baogia/edit"),
        meta: {
          title: "Cập nhật báo giá",
          icon: "eyes"
        },
        hidden: true
      },

      {
        path: "themsanpham",
        name: "Thêm sản phẩm",
        component: () => import("@/views/quanlykho/sanpham/create"),
        meta: {
          title: "Thêm sản phẩm",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "capnhatsanpham/:id",
        name: "Cập nhật sản phẩm",
        component: () => import("@/views/quanlykho/sanpham/edit"),
        meta: {
          title: "Cập nhật sản phẩm",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "hangtonkho",
        name: "Danh sách hàng trong kho",
        component: () => import("@/views/quanlykho/hangtrongkho/index"),
        meta: {
          title: "Hàng tồn kho",
          icon: "danhsachhangtrongkho"
        }
      },
      {
        path: "danhsachkho",
        name: "Danh sách kho",
        component: () => import("@/views/quanlykho/danhsachkho/index"),
        meta: {
          title: "Danh sách kho",
          icon: "danhsachkho"
        }
      }
    ]
  },
  {
    path: "/quanlydonhang",
    component: Layout,
    redirect: "/quanlykho",
    name: "Giao dịch",
    meta: {
      title: "Giao dịch",
      icon: "giaodich"
    },
    children: [
      {
        path: "nhacungcap",
        name: "Đơn hàng nhà cung cấp",
        component: () =>
          import("@/views/quanlydonhang/donhangnhacungcap/index"),
        meta: {
          title: "Đơn hàng nhà cung cấp",
          icon: "donhangnhacungcap"
        }
      },
      {
        path: "trahangnhacungcap",
        name: "Trả hàng nhà cung cấp",
        component: () =>
          import("@/views/quanlydonhang/trahangnhacungcap/index"),
        meta: {
          title: "Trả hàng nhà cung cấp",
          icon: "trahang"
        }
      },
      {
        path: "thanhtoannhacungcap",
        name: "Thanh toán NCC",
        component: () =>
          import("@/views/quanlydonhang/thanhtoanhacungcap/index"),
        meta: {
          title: "Thanh toán NCC",
          icon: "money"
        }
      },
      {
        path: "nhapkho",
        name: "Nhập kho",
        component: () => import("@/views/quanlykho/nhapkho/index"),
        meta: {
          title: "Nhập kho",
          icon: "nhapkho"
        }
      },
      {
        path: "doitrahang",
        name: "Đổi trả hàng",
        component: () => import("@/views/quanlydonhang/doitrahang/index"),
        meta: {
          title: "Đổi trả hàng",
          icon: "mathang"
        }
      },
      {
        path: "doihang/:id",
        name: "Đổi hàng",
        component: () =>
          import("@/views/quanlydonhang/doitrahang/doihang"),
        meta: {
          title: "Đổi hàng",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "khachtrahang/:id",
        name: "Trả hàng",
        component: () =>
          import("@/views/quanlydonhang/doitrahang/trahang"),
        meta: {
          title: "Trả hàng",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "taodonnhacungcap",
        name: "Tạo đơn hàng nhà cung cấp",
        component: () =>
          import("@/views/quanlydonhang/donhangnhacungcap/taodon"),
        meta: {
          title: "Tạo đơn hàng nhà cung cấp",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "capnhatdonhang/:id",
        name: "Cập nhật đơn hàng nhà cung cấp",
        component: () => import("@/views/quanlydonhang/donhangnhacungcap/edit"),
        meta: {
          title: "Cập nhật đơn hàng nhà cung cấp",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "kiemke",
        name: "Kiểm kê kho",
        component: () => import("@/views/quanlykho/kiemke/index"),
        meta: {
          title: "Kiểm kê kho",
          icon: "kiemkho"
        }
      },
      {
        path: "taokiemke",
        name: "Tạo kiểm kê",
        component: () => import("@/views/quanlykho/kiemke/taodon"),
        meta: {
          title: "Tạo kiểm kê",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "thongtinkiemke/:id",
        name: "Thông tin kiểm kê",
        component: () => import("@/views/quanlykho/kiemke/edit"),
        meta: {
          title: "Thông tin kiểm kê",
          icon: "eyes"
        },
        hidden: true
      },
      {
        path: "dathang",
        name: "Đơn đặt hàng",
        component: () => import("@/views/quanlydonhang/dondathang/index"),
        meta: {
          title: "Đơn đặt hàng",
          icon: "dondathang"
        }
      },
      {
        path: "taodondathang",
        name: "Tạo đơn đặt hàng",
        component: () => import("@/views/quanlydonhang/dondathang/taodon"),
        meta: {
          title: "Tạo đơn đặt hàng",
          icon: "dondathang"
        },
        hidden: true
      },
      {
        path: "capnhatdondathang/:id",
        name: "Cập nhật đơn đặt hàng",
        component: () => import("@/views/quanlydonhang/dondathang/edit"),
        meta: {
          title: "Cập nhật đơn đặt hàng",
          icon: "dondathang"
        },
        hidden: true
      },
      {
        path: "lichsunoptien",
        name: "Lịch sử nộp tiền",
        component: () => import("@/views/doitac/lichsunoptien/index"),
        meta: {
          title: "Lịch sử nộp tiền",
          icon: "money"
        }
      },
      {
        path: "hoadon",
        name: "Hóa đơn",
        component: () => import("@/views/quanlydonhang/hoadon/index"),
        meta: {
          title: "Hóa đơn",
          icon: "hoadon"
        }
      },
      {
        path: "trahang",
        name: "Hóa đơn đã hủy",
        component: () => import("@/views/quanlydonhang/trahang/index"),
        meta: {
          title: "Hóa đơn đã hủy",
          icon: "trahang"
        }
      },
      // {
      //     path: "nhaphang",
      //     name: "Nhập hàng",
      //     component: () => import("@/views/quanlydonhang/lichsugiaohang"),
      //     meta: {
      //         title: "Nhập hàng",
      //         icon: "nhaphang"
      //     }
      // },
      // {
      //     path: "trahangnhap",
      //     name: "Trả hàng nhập",
      //     component: () => import("@/views/quanlydonhang/lichsugiaohang"),
      //     meta: {
      //         title: "Trả hàng nhập",
      //         icon: "trahangnhap"
      //     }
      // },
      {
        path: "xuathuy",
        name: "Xuất hủy",
        component: () => import("@/views/quanlykho/xuathuy/index"),
        meta: {
          title: "Xuất hủy",
          icon: "xuathuy"
        }
      },
      {
        path: "taoxuathuy",
        name: "Tạo xuất hủy",
        component: () => import("@/views/quanlykho/xuathuy/taodon"),
        meta: {
          title: "Tạo Xuất hủy",
          icon: "xuathuy"
        },
        hidden: true
      },
      {
        path: "chitietxuathuy/:id",
        name: "Chi tiết xuất hủy",
        component: () => import("@/views/quanlykho/xuathuy/edit"),
        meta: {
          title: "Chi tiết Xuất hủy",
          icon: "xuathuy"
        },
        hidden: true
      }
    ]
  },
  {
    path: "/tienich",
    component: Layout,
    redirect: "/tienich",
    name: "Nâng cao",
    meta: {
      title: "Nâng cao",
      icon: "tienich"
    },
    children: [
      {
        path: "tichdiemthuong",
        name: "Tích điểm thưởng",
        component: () => import("@/views/tienich/tichdiem/index"),
        meta: {
          title: "Tích điểm thưởng",
          icon: "tichdiemthuong"
        }
      },
      {
        path: "log",
        name: "Lịch sử đăng nhập",
        component: () => import("@/views/user/lichsudangnhap/index"),
        meta: {
          title: "Lịch sử đăng nhập",
          icon: "clock"
        }
      },
      {
        path: "history",
        name: "Lịch sử hoạt động",
        component: () => import("@/views/user/lichsuhoatdong/index"),
        meta: {
          title: "Lịch sử hoạt động",
          icon: "logs"
        }
      },
      {
        path: "role",
        name: "Phân quyền",
        component: () => import("@/views/user/role/index"),
        meta: {
          title: "Phân quyền",
          icon: "gear"
        }
      },
      {
        path: "baiviet",
        name: "Bài viết",
        component: () => import("@/views/caidat/baiviet/index"),
        meta: {
          title: "Bài viết",
          icon: "monngonmoingay"
        }
      },
      {
        path: "vietbai",
        name: "Viết bài",
        component: () => import("@/views/caidat/baiviet/create"),
        meta: {
          title: "Viết bài",
          icon: "monngonmoingay"
        },
        hidden: true
      },
      {
        path: "capnhatbaiviet/:id",
        name: "Cập nhật bài viết",
        component: () => import("@/views/caidat/baiviet/edit"),
        meta: {
          title: "Cập nhật bài viết",
          icon: "capnhatbaiviet"
        },
        hidden: true
      }
    ]
  },
  {
    path: "/baocao",
    component: Layout,
    meta: {
      title: "Báo cáo",
      icon: "graph"
    },
    name: "Báo cáo",
    children: [
      {
        path: "thietbi",
        name: "Báo cáo tài chính",
        component: () => import("@/views/baocao/baocaobanhang"),
        meta: {
          title: "Báo cáo tài chính",
          icon: "report"
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404",
    name: "Người dùng",
    hidden: true
  }
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
