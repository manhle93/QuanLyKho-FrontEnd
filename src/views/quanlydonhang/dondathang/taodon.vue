<template>
  <div
    class="main"
    :style="{ height: hideSidebar ? '100vh' : 'calc(100vh - 50px)' }"
  >
    <el-button
      :style="{ left: khoangCach + 'px' }"
      circle
      size="small"
      class="primary-button buttonAdd"
      icon="el-icon-plus"
      @click="addTab()"
    ></el-button>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <tao-don
          :tabName="'tab' + item.name"
          :dataHangHoa="dataHangHoa"
          v-if="editableTabsValue == item.name"
        ></tao-don>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TaoDon from "./taodon2";
import { getInfor } from "@/api/taikhoan";

export default {
  components: {
    TaoDon,
  },
  data() {
    return {
      editableTabsValue: "2",
      hideSidebar: false,
      editableTabs: [
        {
          title: "HĐ 1",
          name: "1",
        },
        {
          title: "HĐ 2",
          name: "2",
        },
      ],
      tabIndex: 2,
      khoangCach: 204,
      dataHangHoa: [],
    };
  },
  created() {
    this.getTabList();
    getInfor().then((res) => {
      this.role_id = res.data.role_id;
      if (
        this.$route.path == "/quanlydonhang/taodondathang" &&
        this.role_id == 2
      ) {
        this.hideSidebar = true;
      } else {
        this.hideSidebar = false;
      }
    });
  },
  watch: {
    editableTabs: function (val) {
      localStorage.removeItem("tabList");
      localStorage.setItem("tabList", JSON.stringify(val));
    },
    editableTabsValue: function (val) {
      localStorage.removeItem("currentTab");
      localStorage.setItem("currentTab", JSON.stringify(val));
    },
  },
  methods: {
    addTab() {
      let newTabName = this.tabIndex + 1;
      newTabName = newTabName.toString();
      this.tabIndex++;
      let soTab = this.editableTabs.length + 1;
      if (soTab < 10) {
        this.khoangCach = soTab * 82 + 40;
      } else {
        this.khoangCach = 9 * 82 + (soTab - 9) * 90 + 40;
      }
      let max =  Math.max.apply(Math,  this.editableTabs.map(function(o) { return o.name; }))
      this.editableTabs.push({
        title: "HĐ " + (max + 1),
        name: newTabName,
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      localStorage.removeItem("tab" + targetName);
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      let soTab = this.editableTabs.length;
      if (soTab < 10) {
        this.khoangCach = soTab * 82 + 40;
      } else {
        this.khoangCach = 9 * 82 + (soTab - 9) * 90 + 40;
      }
    },
    getTabList() {
      let tabList = localStorage.getItem("tabList");
      let currentTab = localStorage.getItem("currentTab");
      currentTab = currentTab ? JSON.parse(currentTab) : "1";
      if (tabList && tabList != "[]") {
        this.editableTabs = JSON.parse(tabList);
        this.tabIndex = Math.max.apply(Math,  this.editableTabs.map(function(o) { return o.name; }))
        this.editableTabsValue = currentTab;
        let soTab = this.editableTabs.length + 1;
        if (soTab < 10) {
          this.khoangCach = soTab * 82 + 40;
        } else {
          this.khoangCach = 9 * 82 + (soTab - 9) * 90 + 40;
        }
      } else {
        this.editableTabs = [
          {
            title: "HĐ 1",
            name: "1",
          },
          {
            title: "HĐ 2",
            name: "2",
          },
        ];
        this.tabIndex = 2;
        this.editableTabsValue = "2";
        localStorage.removeItem("currentTab");
        localStorage.setItem(
          "currentTab",
          JSON.stringify(this.editableTabsValue)
        );
      }
    },
  },
};
</script>
<style scoped>
.buttonAdd {
  position: absolute;
  top: 17px;
  z-index: 1;
}
.main {
  overflow: hidden;
  padding-top: 15px;
  padding-left: 10px;
}
</style>