<template>
    <div class="page">
        <div class="header">
            <b>GraphQL Schema Comparator</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="header-btn" @click="getResult">
                <i class="iconfont icon-start"></i>&nbsp;&nbsp;Run
            </div>
        </div>
        <div class="main clearfix">
            <div class="main-left clearfix">
                <div class="code-title">new Schema</div>
                <div class="newcode" id="newcode"></div>
                <div class="code-title">old Schema</div>
                <div class="oldcode" id="oldcode"></div>
            </div>
            <div class="main-right clearfix">
                <div class="code-title">Result</div>
                <div class="result" id="result"></div>
                <div v-show="loading" class="mask">
                    <div>
                        <i class="iconfont icon-loading rotate"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
import JSONEditor from "jsoneditor";
export default {
  name: "Main",
  data() {
    return {
      oldSchema: JSON.parse(
        '{"queryType":{"name":"Query"},"mutationType":{"name":"Mutation"}}'
      ),
      newSchema: JSON.parse(
        '{"queryType":{"name":"Query"},"mutationType":{"name":"newMutation"}}'
      ),
      editor1: null,
      editor2: null,
      editor3: null,
      oldValid: true,
      newValid: true,
      loading: false,
      showTips: true
    };
  },

  methods: {
    initEditor() {
      let _this = this;
      this.editor1 = new JSONEditor(document.getElementById("oldcode"), {
        mode: "code",
        mainMenuBar: false,
        statusBar: false,
        onChange() {
          try {
            _this.oldSchema = _this.editor1.get();
            _this.oldValid = true;
          } catch (e) {
            _this.oldValid = false;
          }
        }
      });
      this.editor2 = new JSONEditor(document.getElementById("newcode"), {
        mode: "code",
        mainMenuBar: false,
        statusBar: false,
        onChange() {
          try {
            _this.newSchema = _this.editor2.get();
            _this.newValid = true;
          } catch (e) {
            _this.newValid = false;
          }
        }
      });
      this.editor3 = new JSONEditor(document.getElementById("result"), {
        mode: "code",
        mainMenuBar: false,
        statusBar: false,
        onEditable() {
          return false;
        }
      });

      this.editor1.set(this.oldSchema);
      this.editor2.set(this.newSchema);
    },

    getResult() {
      if (!this.newValid || !this.oldValid || this.loading) return;
      this.loading = true;
      this.$axios
        .post("/api/compare", {
          oldSchema: this.oldSchema,
          newSchema: this.newSchema
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.editor3.set(data.data);
          } else {
            this.editor3.set(data);
          }
          this.loading = false;
        })
        .catch(err => {
          this.editor3.set({ error: err.toString() });
          this.loading = false;
        });
    }
  },

  mounted() {
    this.initEditor();
  },

  beforeDestroy() {
    this.editor1.destroy();
    this.editor2.destroy();
    this.editor3.destroy();
  }
};
</script>

<style scoped>
.page {
  margin: 0px 20px;
}

.header {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 100;
  padding: 0px 20px;
  color: #d8d8d8;
  background: #3c4146;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.header-btn {
  display: inline-block;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  width: 80px;
  height: 48px;
  text-align: center;
}

.header-btn i {
  font-size: 18px;
}

.header-btn:hover {
  color: #ffd04b;
  border-bottom: 2px solid #ffd04b;
}

.main {
}

.footer {
  height: 40px;
}

.main-left {
  float: left;
  width: 45%;
}

.main-right {
  position: relative;
  float: left;
  width: 55%;
}

.code-title {
  height: 30px;
  padding: 0px 20px;
  line-height: 30px;
  font-size: 13px;
  font-weight: bold;
  background: #eee;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.oldcode {
  width: 100%;
  height: 300px;
}

.newcode {
  width: 100%;
  height: 300px;
}

.result {
  width: 100%;
  height: 630px;
  text-align: center;
}
</style>
