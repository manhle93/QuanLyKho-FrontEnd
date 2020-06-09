<template>
  <div class="app-container">
    <h4>Danh sách danh mục</h4>
    <el-row>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; font-size: 13px"
        row-key="id"
        border
        
      >
        <el-table-column prop="ten" label="Tên danh mục" min-width="280"></el-table-column>
        <el-table-column prop="ma" label="Mã danh mục" min-width="280"></el-table-column>
        <el-table-column label="Hành động" align="center" min-width="110">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Thêm"
              placement="top"
              v-if="isParrentId(scope.row.id)"
            >
              <el-button
                size="small"
                class="primary-button"
                icon="el-icon-plus"
                circle
                @click="showFormCreate(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- <template v-else>
              <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showFormUpdate(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="destroy(scope.row.id)"
                ></el-button>
              </el-tooltip>
            </template> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog :title="editing?'Cập nhật danh mục':'Thêm danh mục'" :visible.sync="showDialog" center>
      <el-form :rules="rules" ref="form" :model="form">
        <el-form-item label="Mã danh mục" prop="ma">
          <el-input placeholder="Nhập mã danh mục" v-model="form.ma"></el-input>
        </el-form-item>
        <el-form-item label="Tên danh mục" prop="ten">
          <el-input placeholder="Nhập tên danh mục" v-model="form.ten"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">Hủy</el-button>
        <el-button v-if="editing" type="primary" :loading="btnLoading" @click="update">Cập nhật</el-button>
        <el-button v-else :loading="btnLoading" type="primary" @click="submit">Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  index,
  storeDanhMuc,
  updateDanhMuc,
  destroyDanhMuc
} from "@/api/danhmuc";
export default {
  data() {
    return {
      tableData: [],
      editing: false,
      showDialog: false,
      form: {
        id: "",
        ten: "",
        ma: "",
        parent_id: ""
      },
      loading: false,
      btnLoading: false,
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên danh mục",
            trigger: "blur"
          }
        ],
        ma: [
          {
            required: true,
            message: "Hãy nhập mã danh mục",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        let data = await index();
        this.tableData = data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    isParrentId(id) {
      return this.tableData.map(item => item.id).indexOf(id) == -1
        ? false
        : true;
    },
    showFormUpdate(data) {
      this.editing = true;
      this.form.id = data.id;
      this.form.ten = data.ten;
      this.form.ma = data.ma;
      this.form.parent_id = data.parent_id;
      this.showDialog = true;
    },
    showFormCreate(id) {
      this.editing = false;
      this.form.id = null;
      this.form.ten = "";
      this.form.ma = "";
      this.form.parent_id = id;
      this.showDialog = true;
    },
    async update() {
      try {
        this.btnLoading = true;
        await updateDanhMuc(this.form.id, this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.getData();
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async create() {
      try {
        this.btnLoading = true;
        await storeDanhMuc(this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.getData();
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async destroy(id) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa danh mục này",
          "Warning",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await destroyDanhMuc(id);
        this.getData();
      } catch (error) {
        this.loading = false;
      }
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.create();
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="css">
.el-dialog {
  width: 40%;
}

@media (max-width: 576px) {
  .el-dialog {
    width: 70%;
  }
}
</style>
