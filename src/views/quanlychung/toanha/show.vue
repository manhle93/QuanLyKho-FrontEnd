<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Tòa nhà" label-position="right" prop="ma">
                <el-input
                  placeholder="Nhập vào mã tòa nhà"
                  v-model="form.ma"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Tên tòa nhà" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập vào tên tòa nhà"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Hướng vào tòa nhà"
                label-position="right"
                prop="huong_vao_toa_nha"
              >
                <el-input
                  v-model="form.huong_vao_toa_nha"
                  placeholder="Nhập hướng vào tòa nhà"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Loại hình sở hữu"
                label-position="right"
                prop="loai_hinh_so_huu_id"
              >
                <el-select
                  style="width:100%"
                  v-model="form.loai_hinh_so_huu_id"
                  placeholder="Hãy chọn loại hình sở hữu"
                >
                  <el-option
                    v-for="loaihinh in options.loaihinhsohuus"
                    :key="loaihinh.id"
                    :label="loaihinh.ten"
                    :value="loaihinh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Số điện thoại" label-position="right">
                <br />
                <el-tag
                  :key="tag"
                  v-for="tag in so_dien_thoais"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >{{ tag }}</el-tag>
                <el-input
                  type="number"
                  min="0"
                  suffix-icon="el-icon-phone"
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Thêm SĐT</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Địa chỉ" prop="dia_chi">
                <el-input type="textarea" v-model="form.dia_chi" placeholder="Nhập vào địa chỉ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Chủ tòa nhà" label-position="right" prop="chu_toa_nha">
                <el-input
                  v-model="form.chu_toa_nha"
                  placeholder="Nhập vào chủ tòa nhà"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Đơn vị PCCC" prop="don_vi_pccc_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.don_vi_pccc_id"
                  placeholder="Hãy chọn đơn vị phòng cháy chữa cháy"
                >
                  <el-option
                    v-for="donvi in options.donvis"
                    :key="donvi.id"
                    :label="donvi.ten"
                    :value="donvi.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Cấp quản lý hành chính"
                label-position="right"
                prop="cap_quan_ly_hanh_chinh"
              >
                <el-select
                  v-model="form.cap_quan_ly_hanh_chinh"
                  filterable
                  clearable
                  placeholder="Chọn cấp quản lý hành chính"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in capQuanLyHanhChinh"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Hình thức đầu tư" label-position="right" prop="hinh_thuc_dau_tu">
                <el-select
                  v-model="form.hinh_thuc_dau_tu"
                  filterable
                  clearable
                  placeholder="Chọn hình thức đầu tư"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in hinhThucDauTu"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Loại hình hoạt động"
                label-position="right"
                prop="loai_hinh_hoat_dong"
              >
                <el-select
                  v-model="form.loai_hinh_hoat_dong"
                  filterable
                  clearable
                  placeholder="Chọn loại hình hoạt động"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in loaiHinhHoatDong"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Ngành lĩnh vực"
                label-position="right"
                prop="loai_hinh_hoat_dong"
              >
                <el-select
                  v-model="form.nganh_linh_vuc"
                  filterable
                  clearable
                  placeholder="Chọn ngành lĩnh vực"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in nganhLinhVuc"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Thuộc thành phần kinh tế"
                label-position="right"
                prop="thanh_phan_kinh_te"
              >
                <el-select
                  v-model="form.thanh_phan_kinh_te"
                  filterable
                  clearable
                  placeholder="Chọn thành phần kinh tế"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in thanhPhanKinhTe"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Có phải mua bảo hiểm cháy nổ bắt buộc" label-position="right">
                <br />
                <span style="padding-right: 20px">
                  <el-radio-group v-model="phai_mua_bhcnbb" size="small">
                    <el-radio-button label="Có"></el-radio-button>
                    <el-radio-button label="Không"></el-radio-button>
                  </el-radio-group>
                </span>
                <el-radio-group v-model="da_mua_bhcnbb" v-if="phai_mua_bhcnbb == 'Có'">
                  <el-radio :label="true" border size="small">Đã mua</el-radio>
                  <el-radio :label="false" border size="small">Chưa mua</el-radio>
                </el-radio-group>
                <el-checkbox
                  v-if="phai_mua_bhcnbb == 'Không'"
                  v-model="da_mua_bhcnbb"
                  label="Có mua"
                  border
                  size="small"
                ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 5 }">
              <el-form-item label="Năm thành lập">
                <el-input type="number" :min="0" v-model="form.nam_thanh_lap"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 7 }">
              <el-form-item label="Website">
                <el-input type="text" v-model="form.web"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-upload
                class="upload"
                :action="urlUpload"
                :headers="this.token"
                :before-upload="beforeUpload"
                :data="{ id: this.$route.params.id }"
                :on-change="handleChange"
                :file-list="form.files"
                :on-remove="removeFile"
                :on-preview="download"
              >
                <el-button size="small" type="primary">Đính kèm tập tin</el-button>
                <div slot="tip" class="el-upload__tip">Tài liệu không vượt quá 20M</div>
              </el-upload>
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :md="{ span: 12 }">
              <router-link to="/congtacphongchay/toanha">
                <el-button icon="el-icon-back" type="warning">Quay lại</el-button>
              </router-link>
            </el-col>
            <!-- <el-col :md="{ span: 6 }">
              <div>
                <div>
                  <img
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1590048202.png"
                    style="width: 50px; height: auto"
                  />
                </div>
                <div>
                  <el-button
                    style="background-color: #2E76CC; color: white"
                    icon="el-icon-download"
                    @click="xuatWord"
                    >Xuất World</el-button
                  >
                </div>
              </div>
            </el-col>-->
            <el-col :md="{ span: 12 }">
              <el-button
                icon="el-icon-printer"
                style="background-color: #212F3C; color: white; float: right"
                @click="xuatWord"
              ></el-button>
              <el-button
                style="float: right"
                class="primary-button"
                icon="el-icon-check"
                :loading="loading"
                @click="submit('form')"
              >Cập nhật</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input v-model="form.long" suffix-icon="el-icon-map" placeholder="Nhập kinh độ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input v-model="form.lat" suffix-icon="el-icon-map" placeholder="Nhập vĩ độ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Ngày đăng kí KĐ" label-position="right" prop="ngay_dang_ki_kd">
                <el-date-picker
                  v-model="form.ngay_dang_ki_kd"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày đăng kí"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Ngày hết hạn KĐ" label-position="right" prop="ngay_het_han_kd">
                <el-date-picker
                  v-model="form.ngay_het_han_kd"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày hết hạn"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row :gutter="20">
            <el-col v-if="!disabledTinhThanh" :md="{ span: 12 }">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  style="width:100%"
                  filterable
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
                >
                  <el-option
                    v-for="tinhthanh in options.tinhthanhs"
                    :key="tinhthanh.id"
                    :label="tinhthanh.name"
                    :value="tinhthanh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <br />
              <el-checkbox
                v-model="form.hien_thi_toa_nha"
                style="margin-top:21px; width:100%"
                border
              >Hiển thị bản đồ</el-checkbox>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" v-if="form.lat && form.long">
          <tracking-map
            @getAddress="addr => handleMap(addr)"
            v-if="toanha"
            :item="toanha"
            :id="this.$route.params.id"
          ></tracking-map>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="margin-bottom:200px;margin-top:50px">
          <el-tabs>
            <el-tab-pane label="Thiết bị">
              <el-table :data="form.thiet_bi" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column property="loai_thiet_bi.ten" label="Loại thiết bị"></el-table-column>
                <el-table-column sortable property="ma" label="Mã"></el-table-column>
                <el-table-column sortable property="ten" label="Tên"></el-table-column>
                <el-table-column property="imei" label="Imei"></el-table-column>
                <el-table-column property="ngay_trien_khai" label="Ngày triển khai"></el-table-column>
                <el-table-column property="ngay_het_han" label="Ngày hết hạn"></el-table-column>
                <el-table-column property="trang_thai" label="Trạng thái"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Kiểm tra tòa nhà">
              <el-table :data="form.kiem_tra_toa_nhas" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column sortable property="ngay_kiem_tra" label="Ngày kiểm tra">
                  <template slot-scope="scope">
                    {{
                    formatDate(scope.row.ngay_kiem_tra)
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="quyet_dinh_kiem_tra" label="Quyết định kiểm tra"></el-table-column>
                <el-table-column sortable property="can_bo_kiem_tra" label="Cán bộ kiểm tra  "></el-table-column>
                <el-table-column property="thong_tin" label="Thông tin"></el-table-column>
                <el-table-column property="danh_gia" label="Đánh giá"></el-table-column>
                <el-table-column label="Đính kèm">
                  <template slot-scope="scope">
                    <el-upload
                      class="upload"
                      :action="urlUpload"
                      :headers="token"
                      :data="{
                        id: scope.row.id,
                        type_reference: 'kiem_tra_toa_nha'
                      }"
                      :on-change="handleChange"
                      :file-list="scope.row.files"
                      :on-remove="removeFile"
                      :on-preview="download"
                    >
                      <el-button class="primary-button" size="small">Đính kèm tập tin</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Thẩm duyệt">
              <el-table :data="form.tham_duyets" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column property="ten_van_ban" label="Tên văn bản"></el-table-column>
                <el-table-column property="so_van_ban" label="Số văn bản"></el-table-column>
                <el-table-column sortable property="ngay_cap" label="Ngày cấp">
                  <template slot-scope="scope">
                    {{
                    formatDate(scope.row.ngay_cap)
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="co_quan_cap" label="Cơ quan cấp"></el-table-column>
                <el-table-column property="ghi_chu" label="Ghi chú"></el-table-column>
                <el-table-column label="Đính kèm">
                  <template slot-scope="scope">
                    <el-upload
                      class="upload"
                      :action="urlUpload"
                      :headers="token"
                      :data="{ id: scope.row.id, type_reference: 'tham_duyet' }"
                      :on-change="handleChange"
                      :file-list="scope.row.files"
                      :on-remove="removeFile"
                      :on-preview="download"
                    >
                      <el-button class="primary-button" size="small" type="primary">Đính kèm tập tin</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Các thay đổi về PCCC">
              <div style="display:flex;">
                <el-button
                  icon="el-icon-plus"
                  @click="showFormCreate"
                  circle
                  class="primary-button"
                ></el-button>
              </div>
              <br />
              <el-table :data="form.thay_doi_pcccs" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column property="thoi_gian" label="Thời gian" width="200">
                  <template slot-scope="scope">
                    {{
                    formatDate(scope.row.thoi_gian)
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="noi_dung" label="Nội dung"></el-table-column>
                <el-table-column property="ghi_chu" label="Ghi chú"></el-table-column>
                <el-table-column label="Đính kèm">
                  <template slot-scope="scope">
                    <el-upload
                      class="upload"
                      :action="urlUpload"
                      :headers="token"
                      :before-upload="beforeUpload"
                      :data="{
                        id: scope.row.id,
                        type_reference: 'thay_doi_pccc'
                      }"
                      :on-change="handleChange"
                      :file-list="scope.row.files"
                      :on-remove="removeFile"
                      :on-preview="download"
                    >
                      <el-button class="primary-button" size="small" type="primary">Đính kèm tập tin</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="Hành động" align="center" width="150">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                      <el-button
                        size="mini"
                        style="background-color: #3498DB; color: white"
                        icon="el-icon-edit"
                        circle
                        @click="showUpdateThayDoiPccc(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="xoaThayDoiPccc(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Truyền thông, huấn luyện">
              <el-table :data="form.huan_luyens" border fit highlight-current-row>
                <el-table-column min-width="52" sortable label="STT" align="center">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column sortable label="Thời gian" min-width="96">
                  <template slot-scope="scope" v-if="scope.row.thoi_gian">
                    {{
                    formatDate(scope.row.thoi_gian)
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="145"
                  property="noi_dung"
                  label="Nội dung huấn luyện bồi dưỡng nghiệp vụ PCCC"
                ></el-table-column>
                <el-table-column min-width="136" label="Số lượng đối tượng tham gia" align="center">
                  <el-table-column property="pccc_co_so" label="Lực lượng PCCC cơ sở"></el-table-column>
                  <el-table-column property="quan_ly_lanh_dao" label="Cán bộ quản lý, lãnh đạo"></el-table-column>
                  <el-table-column property="nguoi_lao_dong" label="Người lao động"></el-table-column>
                  <el-table-column property="doi_tuong_khac" label="Đối tượng khác"></el-table-column>
                </el-table-column>
                <el-table-column
                  property="so_giay_cn"
                  label="Số giấy CN HLNV PCCC được cấp"
                  min-width="120"
                ></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Lực lượng PCCC cơ sở">
              <div style="display:flex;">
                <el-button
                  icon="el-icon-plus"
                  @click="showFormCreatePcccCoSo"
                  circle
                  class="primary-button"
                ></el-button>
              </div>
              <br />
              <el-table :data="form.pccc_co_so" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column property="ten" label="Họ tên"></el-table-column>
                <el-table-column property="ngay_sinh" label="Ngày sinh">
                  <template slot-scope="scope">
                    {{
                    formatDate(scope.row.ngay_sinh)
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="dien_thoai" label="Số điện thoại"></el-table-column>
                <el-table-column property="bo_phan" label="Bộ phận công tác"></el-table-column>
                <el-table-column label="Hành động" align="center" width="150">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                      <el-button
                        size="mini"
                        style="background-color: #3498DB; color: white"
                        icon="el-icon-edit"
                        circle
                        @click="showUpdatePcccCoSo(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="xoaPcccCoSo(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="Phương tiện PCCC và CNCH">
              <div style="display:flex;">
                <el-button
                  icon="el-icon-plus"
                  @click="showFormCreatePhuongTien"
                  circle
                  class="primary-button"
                ></el-button>
              </div>
              <br />
              <el-table :data="form.phuong_tien" border fit highlight-current-row>
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column property="ten" label="Tên phương tiện"></el-table-column>
                <el-table-column property="loai" label="Loại phương tiện"></el-table-column>
                <el-table-column property="loai_chi_tiet" label="Phân loại chi tiết"></el-table-column>
                <el-table-column property="so_luong" label="Số lượng"></el-table-column>
                <el-table-column property="tinh_trang" label="Tình trạng hoạt động"></el-table-column>
                <el-table-column property="vi_tri" label="Vị trí lắp đặt"></el-table-column>
                <el-table-column label="Hành động" align="center" width="150">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                      <el-button
                        size="mini"
                        style="background-color: #3498DB; color: white"
                        icon="el-icon-edit"
                        circle
                        @click="showUpdatePhuongTien(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="xoaPhuongTien(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Vi phạm">
              <el-table
                :data="form.vi_phams"
                border
                fit
                highlight-current-row
                style="font-size: 13px"
              >
                <el-table-column label="STT" type="index" align="center"></el-table-column>
                <el-table-column width="200" label="Thời gian" min-width="96">
                  <template slot-scope="scope" v-if="scope.row.thoi_gian">
                    {{
                    formatDate(scope.row.thoi_gian)
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="Hành vi vi phạm quy định về PCCC" align="center">
                  <el-table-column prop="noi_dung_hanh_vi" label="Nội dung hành vi cụ thể"></el-table-column>
                  <el-table-column label="Nhóm hành vi">
                    <template slot-scope="scope">
                      <div v-if="scope.row.nhom_hanh_vis.length > 0">
                        <span v-for="(item, index) in scope.row.nhom_hanh_vis" :key="item.id">
                          {{ index + 1 }}. {{ item.ten_nhom_hanh_vi }}
                          <br />
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="doi_tuong_vi_pham" label="Đối tượng vi phạm" align="center"></el-table-column>
                <el-table-column label="Biện pháp xử lý" align="center">
                  <el-table-column label="Cảnh cáo">
                    <template slot-scope="scope">
                      <el-tag type="danger" effect="plain" v-if="scope.row.canh_cao">Đã cảnh cáo</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="phat_tien" label="Phạt tiền (Triệu đồng)">
                    <template slot-scope="scope">
                      <div v-if="scope.row.phat_tien">{{ scope.row.phat_tien }} (VNĐ)</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Tạm đình chỉ">
                    <template slot-scope="scope">
                      <div v-if="scope.row.tam_dinh_chi">
                        Từ ngày: {{ formatDate(scope.row.ngay_tam_dinh_chi) }}
                        <br />
                        Đến ngày: {{ formatDate(scope.row.ngay_phuc_hoi) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Đình chỉ">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.dinh_chi" type="danger" effect="plain">Đã đình chỉ</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="xu_ly_khac" label="Xử lý khác"></el-table-column>
                </el-table-column>
                <el-table-column label="File đính kèm">
                  <template slot-scope="scope">
                    <el-upload
                      class="upload"
                      :action="urlUpload"
                      :headers="token"
                      :data="{
                        id: scope.row.id,
                        type_reference: 'xu_ly_vi_pham'
                      }"
                      :before-upload="beforeUpload"
                      :on-change="handleChange"
                      :file-list="scope.row.files"
                      :on-remove="removeFile"
                      :on-preview="download"
                    >
                      <el-button class="primary-button" size="small">Đính kèm tập tin</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Vụ cháy">
              <el-table
                :data="form.vu_chays"
                border
                fit
                highlight-current-row
                style="font-size: 13px"
              >
                <el-table-column width="100" label="STT" align="center">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column width="200" label="Thời gian báo cháy" min-width="96">
                  <template slot-scope="scope" v-if="scope.row.thoi_gian_bao_chay">
                    {{
                    formatDateTime(scope.row.thoi_gian_bao_chay)
                    }}
                  </template>
                </el-table-column>
                <el-table-column width="200" label="Thời gian bắt đầu xử lý" min-width="96">
                  <template slot-scope="scope" v-if="scope.row.thoi_gian_bat_dau_xu_ly">
                    {{
                    formatDateTime(scope.row.thoi_gian_bat_dau_xu_ly)
                    }}
                  </template>
                </el-table-column>
                <el-table-column width="200" label="Thời gian kết thúc" min-width="96">
                  <template slot-scope="scope" v-if="scope.row.thoi_gian_ket_thuc">
                    {{
                    formatDateTime(scope.row.thoi_gian_ket_thuc)
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cam_bien_first.vi_tri"
                  label="Vị trí cảm biến đầu tiên"
                  align="center"
                ></el-table-column>
                <el-table-column prop="mo_ta" label="Mô tả" align="center"></el-table-column>
                <el-table-column prop="nguyen_nhan" label="Nguyên nhân" align="center"></el-table-column>
                <el-table-column
                  prop="uoc_tinh_thiet_hai"
                  label="Ước tính thiệt hại"
                  align="center"
                ></el-table-column>
                <el-table-column prop="so_nguoi_chet" label="Số người chết" align="center"></el-table-column>
                <el-table-column
                  prop="so_nguoi_bi_thuong"
                  label="Số người bị thương"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="so_nguoi_tham_gia_chua_chay"
                  label="Số người tham gia chữa cháy"
                  align="center"
                ></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      :title="
        edit ? 'Cập nhật thông tin thay đổi' : 'Thay đổi liên quan đến PCCC'
      "
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form ref="formThayDoiPccc" :model="formThayDoiPccc" :rules="rulesFormThayDoi">
        <el-form-item label="Thời gian">
          <br />
          <el-date-picker
            style="width: 100%"
            v-model="formThayDoiPccc.thoi_gian"
            type="date"
            placeholder="Thời gian"
            format="dd/MM/yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Nội dung thay đổi" prop="noi_dung">
          <el-input
            type="textarea"
            v-model="formThayDoiPccc.noi_dung"
            placeholder="Nội dung thay đổi"
          ></el-input>
        </el-form-item>
        <el-form-item label="Ghi chú">
          <el-input type="textarea" v-model="formThayDoiPccc.ghi_chu" placeholder="Ghi chú"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" icon="el-icon-close" @click="cancelThayDoiPccc">Hủy</el-button>
        <el-button
          v-if="!edit"
          style="background-color: #3498DB; color: white"
          icon="el-icon-plus"
          :loading="btnLoading"
          @click="addThayDoiPccc('formThayDoiPccc')"
        >Thêm mới</el-button>
        <el-button
          v-else
          style="background-color: #3498DB; color: white"
          icon="el-icon-check"
          :loading="btnLoading"
          @click="updateThayDoiPccc('formThayDoiPccc')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="
        editPhuongTien
          ? 'Cập nhật Phương tiện PCCC và CNCH'
          : 'Thêm phương tiện PCCC và CNCH'
      "
      :visible.sync="showFormPhuongTien"
      width="35%"
      center
    >
      <el-form ref="formPhuongTien" :model="formPhuongTien" :rules="rulesFormPhuongTien">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Tên phương tiện" prop="ten">
              <el-input v-model="formPhuongTien.ten" placeholder="Tên phương tiện"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại phương tiện">
              <el-input v-model="formPhuongTien.loai" placeholder="Nhập loại phương tiện"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phân loại chi tiết">
              <el-input
                v-model="formPhuongTien.loai_chi_tiet"
                placeholder="Nhập chi tiết phân loại"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số lượng">
              <el-input
                v-model="formPhuongTien.so_luong"
                placeholder="Nhập số lượng"
                type="number"
                :min="0"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tình trạng hoạt động">
              <el-select
                v-model="formPhuongTien.tinh_trang"
                placeholder="Chọn tình trạng"
                style="width: 100%"
              >
                <el-option value="Tốt"></el-option>
                <el-option value="Trung bình"></el-option>
                <el-option value="Kém"></el-option>
                <el-option value="Hư hỏng"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Vị trí lắp đặt">
              <el-input v-model="formPhuongTien.vi_tri" placeholder="Vị trí lắp đặt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" icon="el-icon-close" @click="cancelPhuongTien">Hủy</el-button>
        <el-button
          v-if="!editPhuongTien"
          style="background-color: #3498DB; color: white"
          icon="el-icon-plus"
          :loading="btnLoading"
          @click="addPhuongTien('formPhuongTien')"
        >Thêm mới</el-button>
        <el-button
          v-else
          style="background-color: #3498DB; color: white"
          icon="el-icon-check"
          :loading="btnLoading"
          @click="updatePhuongTien('formPhuongTien')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="
        editPcccCoSo
          ? 'Cập nhật thông tin lực lượng PCCC cơ sở'
          : 'Thêm lực lượng PCCC cơ sở'
      "
      :visible.sync="showFormPcccCoSo"
      width="35%"
      center
    >
      <el-form ref="formPcccCoSo" :model="formPcccCoSo" :rules="rulesFormPcccCoSo">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Họ tên" prop="ten">
              <el-input v-model="formPcccCoSo.ten" placeholder="Nhập họ và tên"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày sinh" prop="ngay_sinh">
              <br />
              <el-date-picker
                style="width: 100%"
                format="dd/MM/yyyy"
                v-model="formPcccCoSo.ngay_sinh"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bộ phận công tác">
              <el-input v-model="formPcccCoSo.bo_phan" placeholder="Nhập bộ phận công tác"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số điện thoại">
              <el-input v-model="formPcccCoSo.dien_thoai" placeholder="Nhập số điện thoại"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-checkbox
              v-model="formPcccCoSo.duoc_cap_giay_cn"
              label="Được cấp giấy CNHLNVPCCC"
              border
              size="medium"
            ></el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox
              v-model="formPcccCoSo.doi_truong"
              label="Đội trưởng đội PCCC cơ sở"
              border
              size="medium"
            ></el-checkbox>
          </el-col>
          <el-col :span="12">
            <br />
            <el-checkbox
              v-model="formPcccCoSo.trong_gio_lam_viec"
              label="Trong giờ làm việc"
              border
              size="medium"
            ></el-checkbox>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" icon="el-icon-close" @click="cancelPcccCoSo">Hủy</el-button>
        <el-button
          v-if="!editPcccCoSo"
          style="background-color: #3498DB; color: white"
          icon="el-icon-plus"
          :loading="btnLoading"
          @click="addPcccCoSo('formPcccCoSo')"
        >Thêm mới</el-button>
        <el-button
          v-else
          style="background-color: #3498DB; color: white"
          icon="el-icon-check"
          :loading="btnLoading"
          @click="updatePcccCoSo('formPcccCoSo')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import TrackingMap from "./map-detail";
import TrackingMap from "./map";
import {
  editData,
  getDataDetail,
  getDonvi,
  removeFile,
  addThayDoiPCCC,
  xoaThayDoiPCCC,
  updateThayDoiPCCC,
  addPcccCoSo,
  updatePcccCoSo,
  xoaPcccCoSo,
  addPhuongTien,
  updatePhuongTien,
  xoaPhuongTien
} from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getDanhMucCon } from "@/api/danhmuc";
import { getToken } from "@/utils/auth";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";
import axios from "axios";

export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      toanha: null,
      disabledTinhThanh: true,
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      token: {},
      edit: false,
      editPcccCoSo: false,
      editPhuongTien: false,
      btnLoading: false,
      capQuanLyHanhChinh: [],
      hinhThucDauTu: [],
      loaiHinhHoatDong: [],
      nganhLinhVuc: [],
      thanhPhanKinhTe: [],
      phai_mua_bhcnbb: "Không",
      da_mua_bhcnbb: false,
      form: {
        cap_quan_ly_hanh_chinh: "",
        hinh_thuc_dau_tu: "",
        thanh_phan_kinh_te: "",
        loai_hinh_hoat_dong: "",
        nganh_linh_vuc: "",
        phai_mua_bhcnbb: false,
        da_mua_bhcnbb: false,
        ma: "",
        ten: "",
        dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        huong_vao_toa_nha: "",
        loai_hinh_so_huu_id: "",
        hien_thi_toa_nha: true,
        dia_chi: "",
        lat: "",
        long: "",
        don_vi_pccc_id: "",
        files: [],
        thiet_bi: [],
        kiem_tra_toa_nhas: [],
        chu_toa_nha: "",
        ngay_dang_ki_kd: "",
        ngay_het_han_kd: "",
        tham_duyets: [],
        thay_doi_pcccs: [],
        huan_luyens: [],
        vi_phams: [],
        vu_chays: [],
        pccc_co_so: [],
        nam_thanh_lap: null,
        web: null,
        email: null,
        phuong_tien: []
      },
      formThayDoiPccc: {
        toa_nha_id: null,
        thoi_gian: "",
        noi_dung: "",
        ghi_chu: "",
        fileList: []
      },
      formPhuongTien: {
        toa_nha_id: null,
        ten: "",
        loai: "",
        loai_chi_tiet: "",
        so_luong: null,
        tinh_trang: "",
        vi_tri: ""
      },
      formPcccCoSo: {
        toa_nha_id: null,
        ten: "",
        ngay_sinh: null,
        bo_phan: "",
        dien_thoai: "",
        duoc_cap_giay_cn: false,
        doi_truong: false,
        trong_gio_lam_viec: true
      },
      showForm: false,
      showFormPcccCoSo: false,
      showFormPhuongTien: false,
      options: {
        tinhthanhs: [],
        quanhuyens: [],
        loaihinhsohuus: [],
        donvis: []
      },
      rulesFormThayDoi: {
        noi_dung: [
          {
            required: true,
            message: "Nội dung thay đổi không được bỏ trống",
            trigger: "blur"
          }
        ]
      },
      rules: {
        ma: [
          {
            required: true,
            message: "Mã đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten: [
          {
            required: true,
            message: "Tên đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        dia_chi: [
          {
            required: true,
            message: "Địa chỉ không được bỏ trống",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tinhr thành",
            trigger: "blur"
          }
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Hãy nhập số điện thoại",
            trigger: "blur"
          }
        ],
        lat: [
          {
            required: true,
            message: "Vĩ độ không được bỏ trống",
            trigger: "blur"
          }
        ],
        long: [
          {
            required: true,
            message: "Kinh độ không được bỏ trống",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "Email không hợp lệ",
            trigger: "blur"
          }
        ]
      },
      rulesFormPhuongTien: {
        ten: [
          {
            required: true,
            message: "Tên phương tiện không được bỏ trống",
            trigger: "blur"
          }
        ]
      },
      rulesFormPcccCoSo: {
        ten: [
          {
            required: true,
            message: "Họ tên không được bỏ trống",
            trigger: "blur"
          }
        ]
      },
      salary_level_data: [],
      loading: false,
      so_dien_thoais: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    xuatWord() {
      window.location.assign(
        process.env.VUE_APP_BASE_API + "xuatfileword/" + this.$route.params.id
      );
    },
    showFormCreate() {
      this.edit = false;
      this.showForm = true;
      this.formThayDoiPccc = {
        toa_nha_id: null,
        thoi_gian: "",
        noi_dung: "",
        ghi_chu: "",
        fileList: []
      };
    },
    showFormCreatePcccCoSo() {
      this.editPcccCoSo = false;
      this.showFormPcccCoSo = true;
      this.formPcccCoSo = {
        toa_nha_id: null,
        ten: "",
        ngay_sinh: null,
        bo_phan: "",
        dien_thoai: "",
        duoc_cap_giay_cn: false,
        doi_truong: false,
        trong_gio_lam_viec: true
      };
    },
    showUpdatePhuongTien(data) {
      this.cancelPcccCoSo();
      this.editPhuongTien = true;
      this.showFormPhuongTien = true;
      this.formPhuongTien = data;
    },
    showFormCreatePhuongTien() {
      this.editPhuongTien = false;
      this.showFormPhuongTien = true;
      this.formPhuongTien = {
        toa_nha_id: null,
        ten: "",
        loai: "",
        loai_chi_tiet: "",
        so_luong: null,
        tinh_trang: "",
        vi_tri: ""
      };
    },
    showUpdatePcccCoSo(data) {
      this.cancelPcccCoSo();
      this.editPcccCoSo = true;
      this.showFormPcccCoSo = true;
      this.formPcccCoSo = data;
    },
    showUpdateThayDoiPccc(data) {
      this.cancelThayDoiPccc();
      this.edit = true;
      this.showForm = true;
      this.formThayDoiPccc = data;
    },
    async xoaThayDoiPccc(data) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa thay đổi: " +
            data.noi_dung +
            ", ngày: " +
            this.formatDate(data.thoi_gian),
          "Xóa thay đổi về PCCC",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await xoaThayDoiPCCC(data.id);
        this.so_dien_thoais = [];
        this.getDetail(this.$route.params.id);
        this.$message({
          message: "Xóa thành công!",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      var filePath = file.name.split(".").pop();
      var dinhDangChoPhep = [
        "xlsx",
        "xls",
        "xlt",
        "xltx",
        "doc",
        "docx",
        "rar",
        "zip",
        "jpeg",
        "jpg",
        "png",
        "txt",
        "pdf"
      ]; //các tập tin cho phép
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.$message({
          message: "Tập tin không hợp lệ",
          type: "warning"
        });
        if (this.form.fileList) {
          this.form.fileList.pop();
        }
        if (this.form.files) {
          this.form.files.pop();
        }

        return false;
      }
      if (!isLt2M) {
        this.form.fileList.pop();
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false;
      }
      return true;
    },

    addPhuongTien(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.formPhuongTien.toa_nha_id = this.$route.params.id;
          addPhuongTien(this.formPhuongTien)
            .then(res => {
              this.cancelPhuongTien();
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.so_dien_thoais = [];
              this.getDetail(this.$route.params.id);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    addPcccCoSo(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.formPcccCoSo.toa_nha_id = this.$route.params.id;
          addPcccCoSo(this.formPcccCoSo)
            .then(res => {
              this.cancelPcccCoSo();
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.so_dien_thoais = [];
              this.getDetail(this.$route.params.id);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    updatePcccCoSo(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          updatePcccCoSo(this.formPcccCoSo).then(res => {
            this.cancelPcccCoSo();
            this.$message({
              message: "Cập nhật thành công!",
              type: "success"
            });
            this.so_dien_thoais = [];
            this.getDetail(this.$route.params.id);
          });
        } else {
          return false;
        }
      });
    },

    async xoaPcccCoSo(data) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa: " + data.ten + " PCCC cơ sở ?",
          "Xóa lực lượng PCCC cơ sở",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await xoaPcccCoSo(data.id);
        this.so_dien_thoais = [];
        this.getDetail(this.$route.params.id);
        this.$message({
          message: "Xóa thành công!",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    },

    async xoaPhuongTien(data) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa phương tiện: " + data.ten + " ?",
          "Xóa phương tiện PCCC",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await xoaPhuongTien(data.id);
        this.so_dien_thoais = [];
        this.getDetail(this.$route.params.id);
        this.$message({
          message: "Xóa thành công!",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    },
    addThayDoiPccc(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.formThayDoiPccc.toa_nha_id = this.$route.params.id;
          this.btnLoading = true;
          addThayDoiPCCC(this.formThayDoiPccc)
            .then(res => {
              this.btnLoading = false;
              this.cancelThayDoiPccc();
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.so_dien_thoais = [];
              this.getDetail(this.$route.params.id);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    updateThayDoiPccc(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.formThayDoiPccc.toa_nha_id = this.$route.params.id;
          this.btnLoading = true;
          updateThayDoiPCCC(this.formThayDoiPccc)
            .then(res => {
              this.btnLoading = false;
              this.cancelThayDoiPccc();
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
              this.so_dien_thoais = [];
              this.getDetail(this.$route.params.id);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    updatePhuongTien(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          updatePhuongTien(this.formPhuongTien)
            .then(res => {
              this.cancelPhuongTien();
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
              this.so_dien_thoais = [];
              this.getDetail(this.$route.params.id);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    cancelThayDoiPccc() {
      this.edit = false;
      this.showForm = false;
      this.formThayDoiPccc = {
        toa_nha_id: null,
        thoi_gian: "",
        noi_dung: "",
        ghi_chu: "",
        fileList: []
      };
    },
    cancelPhuongTien() {
      this.editPhuongTien = false;
      this.showFormPhuongTien = false;
      this.formPhuongTien = {
        toa_nha_id: null,
        ten: "",
        loai: "",
        loai_chi_tiet: "",
        so_luong: null,
        tinh_trang: "",
        vi_tri: ""
      };
    },
    cancelPcccCoSo() {
      this.editPcccCoSo = false;
      this.showFormPcccCoSo = false;
      this.formThayDoiPccc = {
        toa_nha_id: null,
        ten: "",
        ngay_sinh: null,
        bo_phan: "",
        dien_thoai: "",
        duoc_cap_giay_cn: false,
        doi_truong: false,
        trong_gio_lam_viec: true
      };
    },
    formatDate(date) {
      try {
        var d = new Date(date);
        var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        var month =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        return day + "/" + month + "/" + d.getUTCFullYear();
      } catch (error) {
        return null;
      }
    },
    formatDateTime(date) {
      try {
        var d = new Date(date);
        var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        var month =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        return (
          d.getHours() +
          ":" +
          d.getMinutes() +
          " Ngày " +
          day +
          "/" +
          month +
          "/" +
          d.getUTCFullYear()
        );
      } catch (error) {
        return null;
      }
    },
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {}
    },
    changeTinhThanh(val) {
      this.form.don_vi_pccc_id = null;
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
      });
    },
    async getDonVi() {
      let data = await getDonvi();
      this.options.donvis = data.data;
    },
    async getLoaiHinhSoHuu() {
      let data = await getDanhMucCon({ ma: "LHSH" });
      this.options.loaihinhsohuus = data.data;
      let data2 = await getDanhMucCon({ ma: "QL_HC" });
      this.capQuanLyHanhChinh = data2.data;
      let data3 = await getDanhMucCon({ ma: "HTDT" });
      this.hinhThucDauTu = data3.data;
      let data4 = await getDanhMucCon({ ma: "LHHD" });
      this.loaiHinhHoatDong = data4.data;
      let data5 = await getDanhMucCon({ ma: "NNLV" });
      this.nganhLinhVuc = data5.data;
      let data6 = await getDanhMucCon({ ma: "TPKT" });
      this.thanhPhanKinhTe = data6.data;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          delete this.form.so_dien_thoai;
          if (this.so_dien_thoais == null || this.so_dien_thoais.length == 0) {
            this.loading = false;
            return this.$message({
              message: "Bạn chưa nhập số điện thoại tòa nhà",
              type: "warning"
            });
          }
          if (this.phai_mua_bhcnbb == "Không") {
            this.form.phai_mua_bhcnbb = false;
          }
          if (this.phai_mua_bhcnbb == "Có") {
            this.form.phai_mua_bhcnbb = true;
          }
          this.form.da_mua_bhcnbb = this.da_mua_bhcnbb;
          editData(this.$route.params.id, {
            dien_thoais: this.so_dien_thoais,
            form: this.form
          })
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleChange() {},

    removeFile(file) {
      if (file.response) {
        file.id = file.response.result;
      }
      removeFile(file.id)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "Xóa thành công!",
            type: "success"
          });
        })
        .catch(error => {
          this.loading = false;
        });
    },
    download(file) {
      if (!file.id) {
        file.id = file.response.result;
      }
      axios({
        url: process.env.VUE_APP_BASE_API + "building/" + file.id + "/file",
        method: "GET",
        headers: { ["Authorization"]: "Bearer " + getToken() },
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
      });
    },
    resetForm() {
      this.form = {
        ma: "",
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        huong_vao_toa_nha: "",
        loai_hinh_so_huu_id: "",
        hien_thi_toa_nha: true,
        dia_chi: "",
        lat: "",
        long: "",
        don_vi_pccc_id: "",
        files: [],
        chu_toa_nha: "",
        ngay_dang_ki_kd: "",
        ngay_het_han_kd: ""
      };
    },
    handleClose(tag) {
      this.so_dien_thoais.splice(this.so_dien_thoais.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.so_dien_thoais.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    async getDetail(id) {
      let toanha = await getDataDetail(id);
      this.toanha = toanha.data;
      for (let field in this.form) {
        this.form[field] = this.toanha[field];
      }
      for (var nha of this.toanha.so_dien_thoai) {
        if (nha != null) {
          this.so_dien_thoais.push(nha.so_dien_thoai);
        }
      }
      this.da_mua_bhcnbb = this.form.da_mua_bhcnbb;
      if (this.form.phai_mua_bhcnbb) {
        this.phai_mua_bhcnbb = "Có";
      }
      this.loading = false;
      getDonvi({ tinh_thanh_id: this.toanha.tinh_thanh_id }).then(res => {
        this.options.donvis = res.data;
      });
      return true;
    }
  },
  created() {
    this.getData(getTinhThanh, "tinhthanhs");
    this.getData(getQuanHuyen, "quanhuyens");
    this.getDetail(this.$route.params.id);
    this.getLoaiHinhSoHuu();
    this.getDonVi();
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },

  watch: {}
};
</script>
<style lang="css" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed black;

  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  border: 1px dashed black;
  /* border-radius: 50%; */
  /* width: 200px;
          height: 200px; */
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 180px;
  margin-left: 10px;
  vertical-align: bottom;
}
@media (max-width: 990px) {
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
