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
        path: "/giamsat",
        component: Layout,
        redirect: "/giamsat",
        children: [
            {
                path: "giamsat",
                name: "Giám sát trực tuyến",
                component: () => import("@/views/dashboard/index"),
                meta: {
                    title: "Giám sát trực tuyến",
                    icon: "map"
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
        path: "/danhmuc",
        component: Layout,
        redirect: "/danhmuc",
        name: "Danh mục",
        children: [
            {
                path: "management",
                name: "Danh sách danh mục",
                component: () => import("@/views/danhmuc/index"),
                meta: {
                    title: "Danh sách danh mục",
                    icon: "grid"
                }
            }
        ]
    },

    {
        path: "/donvipccc",
        component: Layout,
        redirect: "/donvipccc",
        name: "Quản lý đơn vị PCCC",
        children: [
            {
                path: "quanlychung",
                name: "Quản lý đơn vị PCCC",
                component: () => import("@/views/quanlydonvi/index"),
                meta: {
                    title: "Quản lý đơn vị PCCC",
                    icon: "shield"
                }
            }
        ]
    },

    {
        path: "/congtacphongchay",
        component: Layout,
        meta: {
            title: "Quản lý công tác phòng cháy",
            icon: "security"
        },
        name: "Quản lý công tác phòng cháy",
        children: [
            {
                path: "lichtruc",
                name: "Quản lý lịch trực",
                component: () => import("@/views/quanlycongtacphongchay/quanlylichtruc/index"),
                meta: {
                    title: "Quản lý lịch trực",
                    icon: "lichtruc"
                }
            },
            {
                path: "lichtruc/them",
                name: "Thêm mới lịch trực",
                component: () => import("@/views/quanlycongtacphongchay/quanlylichtruc/create"),
                meta: {
                    title: "Thêm mới lịch trực"
                },
                hidden: true
            },
            {
                path: "lichtruc/show/:id",
                name: "Cập nhật lịch trực",
                component: () => import("@/views/quanlycongtacphongchay/quanlylichtruc/show"),
                meta: {
                    title: "Cập nhật lịch trực"
                },
                hidden: true
            },


            {
                path: "toanha",
                name: "Quản lý tòa nhà",
                component: () => import("@/views/quanlychung/toanha/index"),
                meta: {
                    title: "Quản lý cơ sở và công trình",
                    icon: "toanha"
                }
            },
            {
                path: "toanha/create",
                name: "Thêm mới tòa nhà",
                component: () => import("@/views/quanlychung/toanha/create"),
                meta: {
                    title: "Thêm mới cơ sở và công trình"
                },
                hidden: true
            },
            {
                path: "toanha/show/:id",
                name: "Thông tin tòa nhà",
                component: () => import("@/views/quanlychung/toanha/show"),
                meta: {
                    title: "Thông tin cơ sở và công trình"
                },
                hidden: true
            },
            {
                path: "kiemtratoanha",
                name: "Kiểm tra tòa nhà",
                component: () => import("@/views/quanlychung/kiemtratoanha/index"),
                meta: {
                    title: "Kiểm tra cơ sở và công trình",
                    icon: "kttoanha"
                }
            },
            {
                path: "kiemtratoanha/create",
                name: "Thêm mới kiểm tra tòa nhà",
                component: () => import("@/views/quanlychung/kiemtratoanha/create"),
                meta: {
                    title: "Thêm mới kiểm tra cơ sở và công trình"
                },
                hidden: true
            },
            {
                path: "kiemtratoanha/show/:id",
                name: "Thông tin kiểm tra tòa nhà",
                component: () => import("@/views/quanlychung/kiemtratoanha/show"),
                meta: {
                    title: "Kiểm tra cơ sở và công trình"
                },
                hidden: true
            },
            {
                path: "dancu",
                name: "Quản lý dân cư",
                component: () => import("@/views/quanlychung/dancu/index"),
                meta: {
                    title: "Quản lý dân cư",
                    icon: "dancu"
                }
            },
            {
                path: "truyenthong",
                name: "Truyền thông, huấn luyện PCCC",
                component: () => import("@/views/quanlycongtacphongchay/truyenthonghuanluyen/index"),
                meta: {
                    title: "Tuyên truyền, huấn luyện PCCC",
                    icon: "truyenthong"
                }
            },
            {
                path: "truyenthonghuanluyen/them",
                name: "Thêm mới công tác truyền thông, huấn luyện PCCC",
                component: () => import("@/views/quanlycongtacphongchay/truyenthonghuanluyen/create"),
                meta: {
                    title: "Thêm mới công tác tuyên truyền, huấn luyện PCCC"
                },
                hidden: true
            },
            {
                path: "truyenthonghuanluyen/show/:id",
                name: "Cập nhật công tác truyền thông, huấn luyện PCCC",
                component: () => import("@/views/quanlycongtacphongchay/truyenthonghuanluyen/show"),
                meta: {
                    title: "Cập nhật công tác tuyên truyền, huấn luyện PCCC"
                },
                hidden: true
            },
            {
                path: "thamdinhpheduyet",
                name: "Thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/thamdinhpheduyet/index"),
                meta: {
                    title: "Thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC",
                    icon: "thamduyet"
                }
            },
            {
                path: "thamdinhpheduyet/them",
                name: "Thêm mới thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/thamdinhpheduyet/create"),
                meta: {
                    title: "Thêm mới thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC"
                },
                hidden: true
            },
            {
                path: "thamdinhpheduyet/show/:id",
                name: "Cập nhật thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/thamdinhpheduyet/show"),
                meta: {
                    title: "Cập nhật thẩm duyệt và cấp giấy chứng nhận đủ điều kiện về PCCC"
                },
                hidden: true
            },

            {
                path: "xulyvipham",
                name: "Xử lý vi phạm về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/xulyvipham/index"),
                meta: {
                    title: "Xử lý vi phạm về PCCC",
                    icon: "vipham"
                }
            },

            {
                path: "xulyvipham/them",
                name: "Thêm mới xử lý vi phạm về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/xulyvipham/create"),
                meta: {
                    title: "Thêm mới xử lý vi phạm về PCCC",
                    icon: "ios-people"
                },
                hidden: true
            },

            {
                path: "xulyvipham/show/:id",
                name: "Cập nhật xử lý vi phạm về PCCC",
                component: () => import("@/views/quanlycongtacphongchay/xulyvipham/show"),
                meta: {
                    title: "Cập nhật xử lý vi phạm về PCCC",
                    icon: "ios-people"
                },
                hidden: true
            },
        ]
    },

    {
        path: "/chuachayvacnch",
        component: Layout,
        meta: {
            title: "Công tác chữa cháy và CNCH",
            icon: "example"
        },
        name: "Công tác chữa cháy và CNCH",
        children: [
            {
                path: "chuachay",
                name: "Quản lý điểm cháy",
                component: () => import("@/views/quanlychung/diemchay/index"),
                meta: {
                    title: "Công tác chữa cháy",
                    icon: "fire"
                }
            },
            {
                path: "xaydungphuonganpccc",
                name: "Xây dựng thực tập phương án PCCC",
                component: () => import("@/views/quanlycongtacphongchay/xaydungphuonganpccc/index"),
                meta: {
                    title: "Xây dựng thực tập phương án PCCC",
                    icon: "thuctap"
                }
            },
            {
                path: "xaydungphuonganpccc/them",
                name: "Thêm mới công tác xây dựng thực tập phương án chữa cháy",
                component: () => import("@/views/quanlycongtacphongchay/xaydungphuonganpccc/create"),
                meta: {
                    title: "Thêm mới công tác xây dựng thực tập phương án chữa cháy"
                },
                hidden: true
            },
            {
                path: "xaydungphuonganpccc/show/:id",
                name: "Cập nhật công tác xây dựng thực tập phương án chữa cháy",
                component: () => import("@/views/quanlycongtacphongchay/xaydungphuonganpccc/show"),
                meta: {
                    title: "Cập nhật công tác xây dựng thực tập phương án chữa cháy"
                },
                hidden: true
            },
            {
                path: "cuunancuuho",
                name: "Công tác CNCH",
                component: () => import("@/views/quanlychung/cuunancuuho/index"),
                meta: {
                    title: "Công tác CNCH",
                    icon: "lifebuoy"
                }
            },
            {
                path: "cuunancuuho/show/:id",
                name: "Thông tin công tác cứu hộ cứu nạn",
                component: () => import("@/views/quanlychung/cuunancuuho/show"),
                meta: {
                    title: "Thông tin công tác cứu hộ cứu nạn",
                    icon: "lifebuoy"
                },
                hidden: true
            },
            {
                path: "cuunancuuho/create",
                name: "Thêm mới công tác CNCH",
                component: () => import("@/views/quanlychung/cuunancuuho/create"),
                meta: {
                    title: "Thêm mới công tác CNCH",
                    icon: "lifebuoy"
                },
                hidden: true
            },
            {
                path: "diemchay/show/:id",
                name: "Thông tin điểm cháy",
                component: () => import("@/views/quanlychung/diemchay/show"),
                meta: {
                    title: "Thông tin điểm cháy"
                },
                hidden: true
            },
        ]
    },
    {
        path: "/quanlydonvipccc",
        component: Layout,
        name: "Quản lý PCCC",
        hidden: true,
        meta: {
            title: "Quản lý PCCC",
            icon: "security"
        },
        children: [
            {
                path: "donvipccc",
                name: "Đơn vị PCCC",
                component: () => import("@/views/quanlydonvipccc/donvipccc/index"),
                meta: {
                    title: "Đơn vị PCCC",
                    icon: "fire-station"
                }
            },
            {
                path: "donvipccc/create",
                name: "Thêm mới đơn vị PCCC",
                component: () => import("@/views/quanlydonvipccc/donvipccc/create"),
                meta: {
                    title: "Thêm đơn vị pccc"
                },
                hidden: true
            },
            {
                path: "donvipccc/show/:id",
                name: "Thông tin đơn vị PCCC",
                component: () => import("@/views/quanlydonvipccc/donvipccc/show"),
                meta: {
                    title: "Thông tin đơn vị PCCC"
                },
                hidden: true
            },
            {
                path: "phuongtienpccc",
                name: "Phương tiện PCCC",
                component: () => import("@/views/quanlydonvipccc/phuongtienpccc/index"),
                meta: {
                    title: "Phương tiện PCCC",
                    icon: "fire-truck"
                }
            },
            {
                path: "diemlaynuoc",
                name: "Điểm lấy nước",
                component: () => import("@/views/quanlydonvipccc/diemlaynuoc/index"),
                meta: {
                    title: "Điểm lấy nước",
                    icon: "fire-hydrant"
                }
            },
            {
                path: "diemlaynuoc/create",
                name: "Thêm mới điểm lấy nước",
                component: () => import("@/views/quanlydonvipccc/diemlaynuoc/create"),
                meta: {
                    title: "Điểm lấy nước"
                },
                hidden: true
            },
            {
                path: "diemlaynuoc/show/:id",
                name: "Thông tin điểm lấy nước",
                component: () => import("@/views/quanlydonvipccc/diemlaynuoc/show"),
                meta: {
                    title: "Điểm lấy nước"
                },
                hidden: true
            },
            {
                path: "donvihotro",
                name: "Đơn vị hỗ trợ",
                component: () => import("@/views/quanlydonvipccc/donvihotro/index"),
                meta: {
                    title: "Đơn vị hỗ trợ",
                    icon: "telephone"
                }
            },
            {
                path: "donvihotro/create",
                name: "Thêm mới đơn vị hỗ trợ",
                component: () => import("@/views/quanlydonvipccc/donvihotro/create"),
                meta: {
                    title: "Thêm đơn vị hỗ trợ"
                },
                hidden: true
            },
            {
                path: "donvihotro/show/:id",
                name: "Thông tin đơn vị hỗ trợ",
                component: () => import("@/views/quanlydonvipccc/donvihotro/show"),
                meta: {
                    title: "Thông tin đơn vị hỗ trợ"
                },
                hidden: true
            }
        ]
    },
    {
        path: "/quanlythietbi",
        component: Layout,
        meta: {
            title: "Quản lý thiết bị SFUL",
            icon: "folder"
        },
        name: "Quản lý thiết bị SFUL",
        children: [
            {
                path: "cambien",
                name: "Quản lý cảm biến",
                component: () => import("@/views/quanlychung/cambien/index"),
                meta: {
                    title: "Quản lý cảm biến",
                    icon: "sensor"
                }
            },
            {
                path: "thietbi",
                name: "Quản lý thiết bị",
                component: () => import("@/views/quanlychung/thietbi/index"),
                meta: {
                    title: "Quản lý thiết bị trung tâm",
                    icon: "equipment"
                }
            },
            {
                path: "thietbiquay",
                name: "Quản lý thiết bị quay",
                component: () => import("@/views/quanlychung/thietbiquay/index"),
                meta: {
                    title: "Quản lý thiết bị quay",
                    icon: "camera"
                }
            },

            {
                path: "thietbiquay/create",
                name: "Thêm mới thiết bị quay",
                component: () => import("@/views/quanlychung/thietbiquay/create"),
                meta: {
                    title: "Thêm mới thiết bị quay"
                },
                hidden: true
            },
            {
                path: "thietbiquay/show/:id",
                name: "Thông tin thiết bị quay",
                component: () => import("@/views/quanlychung/thietbiquay/show"),
                meta: {
                    title: "Thông tin thiết bị quay"
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
