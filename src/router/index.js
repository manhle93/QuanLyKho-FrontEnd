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
        redirect: "/trungtamchihuy",
        children: [
            {
                path: "trungtamchihuy",
                name: "Trung tâm chỉ huy",
                component: () => import("@/views/trungtamchihuy/index"),
                meta: {
                    title: "Trung tâm chỉ huy",
                    icon: "home"
                }
            }
        ]
    },
    {
        path: "/404",
        component: () => import("@/views/404_2"),
        hidden: true
    },

    
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: "/users",
        component: Layout,
        redirect: "/users/management",
        name: "Người dùng",
        meta: {
            title: "Người dùng",
            icon: "user"
        },
        children: [
            {
                path: "taikhoan",
                name: "Thông tin tài khoản",
                component: () => import("@/views/user/thongtintaikhoan/index"),
                meta: {
                    title: "Thông tin tài khoản",
                    icon: "eyes"
                }
            },
            {
                path: "management",
                name: "Quản lý người dùng",
                component: () => import("@/views/user/index"),
                meta: {
                    title: "Quản lý người dùng",
                    icon: "multiple-users-silhouette"
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
                    icon: "clock"
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
        name: "Quản lý kho hàng",
        meta: {
            title: "Quản lý kho hàng",
            icon: "user"
        },
        children: [
            {
                path: "loaihanghoa",
                name: "Loại hàng hóa",
                component: () => import("@/views/quanlykho/danhmucsanpham/index"),
                meta: {
                    title: "Loại hàng hóa",
                    icon: "eyes"
                }
            },
            {
                path: "loaimathang",
                name: "Loại mặt hàng",
                component: () => import("@/views/user/thongtintaikhoan/index"),
                meta: {
                    title: "Loại mặt hàng",
                    icon: "eyes"
                }
            },
            {
                path: "hanghoa",
                name: "Danh sách hàng hóa",
                component: () => import("@/views/user/thongtintaikhoan/index"),
                meta: {
                    title: "Danh sách hàng hóa",
                    icon: "eyes"
                }
            },
            {
                path: "kiemke",
                name: "Kiểm kê kho",
                component: () => import("@/views/user/thongtintaikhoan/index"),
                meta: {
                    title: "Kiểm kê kho",
                    icon: "eyes"
                }
            },
            {
                path: "nhapkho",
                name: "Nhập kho",
                component: () => import("@/views/user/thongtintaikhoan/index"),
                meta: {
                    title: "Nhập kho",
                    icon: "eyes"
                }
            },
        ]
    },
    {
        path: "/quanlydonhang",
        component: Layout,
        redirect: "/quanlykho",
        name: "Quản lý đơn hàng",
        meta: {
            title: "Quản lý đơn hàng",
            icon: "user"
        },
        children: [
            {
                path: "nhacungcap",
                name: "Đơn hàng nhà cung cấp",
                component: () => import("@/views/quanlydonhang/donhangnhacungcap/index"),
                meta: {
                    title: "Đơn hàng nhà cung cấp",
                    icon: "eyes"
                }
            },
            {
                path: "dathang",
                name: "Đơn đặt hàng",
                component: () => import("@/views/quanlydonhang/dondathang"),
                meta: {
                    title: "Đơn đặt hàng",
                    icon: "eyes"
                }
            },
            {
                path: "banhang",
                name: "Giao dịch bán hàng",
                component: () => import("@/views/quanlydonhang/giaodichbanhang"),
                meta: {
                    title: "Giao dịch bán hàng",
                    icon: "eyes"
                }
            },
            {
                path: "lichsugiaohang",
                name: "Lịch sử giao hàng",
                component: () => import("@/views/quanlydonhang/lichsugiaohang"),
                meta: {
                    title: "Lịch sử giao hàng",
                    icon: "eyes"
                }
            },
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
                name: "Báo cáo thiết bị",
                component: () => import("@/views/baocao/BaoCaoThietBi"),
                meta: {
                    title: "Báo cáo thiết bị lắp đặt",
                    icon: "report"
                }
            },
            {
                path: "xulychay",
                name: "Báo cáo xử lý cháy",
                component: () => import("@/views/baocao/BaoCaoXuLyChay"),
                meta: {
                    title: "Báo cáo trạng thái xử lý cháy",
                    icon: "report"
                }
            },
            {
                path: "sodiemchay",
                name: "Số điểm cháy",
                component: () => import("@/views/baocao/BaoCaoSoDiemChay"),
                meta: {
                    title: "Báo cáo điểm cháy",
                    icon: "report"
                }
            },
            {
                path: "tytrongthietbi",
                name: "Báo cáo tỷ trọng thiết bị",
                component: () => import("@/views/baocao/BaoCaoTyTrongThietBi"),
                meta: {
                    title: "Báo cáo tỷ trọng thiết bị",
                    icon: "report"
                }
            },
            {
                path: "trangthaiphuongtienpccc",
                name: "Trạng thái phương tiện PCCC",
                component: () => import("@/views/baocao/BaoCaoPhuongTienPCCC"),
                meta: {
                    title: "Trạng thái phương tiện PCCC",
                    icon: "report"
                }
            },
            {
                path: "ketquakiemtra",
                name: "Kết quả kiểm tra AT PCCC",
                component: () => import("@/views/baocao/BaoCaoKetQuaKiemTra"),
                meta: {
                    title: "Kết quả kiểm tra AT PCCC",
                    icon: "report"
                }
            },
            {
                path: "sochiensithamgiachuachay",
                name: "Số lượng CB tham gia chữa cháy",
                component: () => import("@/views/baocao/BaoCaoSoChienSiThamGia"),
                meta: {
                    title: "Số lượng CB tham gia chữa cháy",
                    icon: "report"
                }
            },
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
        mode: 'history', // require service support
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
