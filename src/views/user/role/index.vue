<template>
  <div class="app-container">
    <el-table :data="tableData" v-loading="loading" style="width: 100%" border>
      <el-table-column align="center" label="STT" type="index" width="50"></el-table-column>
      <el-table-column label="Quyền" prop="name"></el-table-column>
      <el-table-column label="Mã" prop="code"></el-table-column>
      <el-table-column label="Mô tả" prop="description"></el-table-column>
      <el-table-column label align="center">
        <template slot-scope="scope">
          <el-button
            class="primary-button"
            @click="showMenuRole(scope.row.id,scope.row.menus)"
            icon="el-icon-setting"
          >Cài đặt</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Menu" :visible.sync="showMenuRoleDialog" width="40%" center>
      <el-table
        :data="tableData1"
        ref="multipleTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="id"
        default-expand-all
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="Tên menu"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleSelection()" type="warning">Bỏ chọn</el-button>
        <el-button @click="addMenuToRole" :loading="btnLoading" class="primary-button">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getMenus, addMenuToRole, getRoleMenu } from "@/api/user";
export default {
  data() {
    return {
      tableData: [],
      tableData1: [],
      loading: false,
      currentRole: "",
      btnLoading: false,
      showMenuRoleDialog: false,
      menus: []
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      let data = await getRoleMenu();
      this.tableData = data.data;
      this.loading = false;
    },
    async getMenus() {
      this.loading = true;
      let data = await getMenus();
      this.tableData1 = data.data;
      this.loading = false;
    },
    async addMenuToRole() {
      this.btnLoading = true;
      await addMenuToRole(this.currentRole, this.menus);
      this.btnLoading = false;
      this.showMenuRoleDialog = false;
      this.getData();
    },
    showMenuRole(id, menus) {
      this.showMenuRoleDialog = true;
      this.currentRole = id;
      let toggleList = [];
      menus = [...menus.map(item => item.id)];
      this.tableData1.forEach(item => {
        if (menus.indexOf(item.id) != -1) {
          toggleList.push(item);
          item;
        }
      });
      setTimeout(() => {
        this.toggleSelection();
        this.toggleSelection(this.filterSelection(this.tableData1, menus));
      }, 0);
    },
    handleSelectionChange(val) {
      this.menus = [...val.map(item => item.id)];
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    filterSelection(menuList, menus) {
      const toggleList = [];
      menuList.forEach(menu => {
        if (menus.indexOf(menu.id) != -1) {
          if (menu.children) {
            menu.children.forEach(child => {
              if (menus.indexOf(child.id) != -1) toggleList.push(child);
            });
          }
          toggleList.push(menu);
        }
      });
      return toggleList;
    }
  },
  created() {
    this.getData();
    this.getMenus();
  }
  // watch: {
  //     menus: function() {
  //         alert(this.menus);
  //     }
  // }
};
</script>
