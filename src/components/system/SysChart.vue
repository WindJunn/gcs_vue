<template>
  <!-- <div class="echarts-content"> -->
  <el-row>
    <div class="echarts-input">
      <el-col :span="8">
        <el-date-picker v-model="startYear" type="year" placeholder="选择年"></el-date-picker>
        <div style="margin-top:10px">&nbsp;&nbsp;至&nbsp;&nbsp;</div>
        <el-date-picker v-model="endYear" type="year" placeholder="选择年"></el-date-picker>
      </el-col>
      <el-col :span="10">
        <el-tag style="margin-top:5px">所属公司:</el-tag>
        <el-popover
          v-model="showOrHidePop2"
          placement="right"
          title="请选择公司"
          trigger="manual"
          style="width:200px;margin-top:5px"
        >
          <el-tree
            :data="deps"
            :default-expand-all="false"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick2"
          ></el-tree>
          <div
            slot="reference"
            style="width: 200px;height: 36px;margin-top:5px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
            @click="showDepTree2"
            v-bind:style="{color: depTextColor}"
          >{{department.departmentName}}</div>
        </el-popover>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 5px;margin-top:5px"
          icon="el-icon-search"
          @click="queryCoursePieChart()"
        >搜索</el-button>
      </el-col>
    </div>

   
    <el-col :span="24">
      <div class="echarts-box1">
        <div id="pipelineOption" class="echarts"></div>
      </div>
    </el-col>
    <div>
      <el-col :span="12" v-for="(item,index) in datas" :key="index">
        <div class="echarts-box">
          <div :ref="'chartComponent'+index" :id="'chartComponent'+index" class="echarts"></div>
        </div>
      </el-col>
    </div>
  </el-row>
</template>

<style scoped>
.echarts-content {
  width: 100%;
  height: 100%;
  margin-top: 30px;
  /* display: flex;
    justify-content: center;
    flex-wrap: wrap; */
}

.echarts-input {
  width: 90%;
  height: 40px;
  margin: 30px 0;
  box-shadow: 1px 1px 10px #6d83f1;
  padding: 10px 10px 10px 10px;
  border-radius: 15px;
}

.echarts-input .el-col-8 {
  display: flex;
}

.echarts-input .el-col-10 span {
  vertical-align: middle;
}

/**
   * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
   * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
   */
.echarts-box,
.echarts-box1 {
  height: 300px;
  margin-right: 20px;
}

.echarts-box1 .echarts,
.el-col-12:nth-of-type(2n) .echarts-box .echarts {
  border-right: 0;
  margin-right: 0;
}

.echarts {
  width: 100%;
  height: 100%;
  border-right: 1px solid #e4e4e4;
}
</style>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和图例组件
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll");
export default {
  data() {
    return {
      defaultProps: {
        label: "name",
        isLeaf: "leaf",
        children: "children"
      },
      pipelineOption: {
        title: {
          text: "不同管线环焊缝数量",
          subtext: "按管线分类",
          y: "0",
          textStyle: {
            color: "#222",
            fontStyle: "normal",
            fontWeight: "600",
            fontFamily: "san-serif",
            fontSize: 16
          }
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",

          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            // datas:[],
            name: "数量",
            type: "bar",
            barWidth: "40%",
            data: [10, 52, 200, 334, 390, 330, 220],
            label: {
              normal: {
                show: true,
                position: "top",
                formatter: function(params) {
                  //避免文字太长做省略处理
                  // var name = params.name; //名字
                  // var percent = params.percent; //占比
                  // var value = params.value; //数量
                  return params.value + "道";
                }
              }
            }
          }
        ]
      },

      chartComponent: {
        title: {
          text: "11",
          subtext: "11",
          x: "left",
          textStyle: {
            color: "#222",
            fontStyle: "normal",
            fontWeight: "600",
            fontFamily: "san-serif",
            fontSize: 16
          }
        },
        tooltip: {
          trigger: "item",
          /* formatter: "{a} <br/>{b} : ({c}道) {d}%"*/
          formatter: "{a} {b} : ({c}道) {d}%"
        },
        legend: {
          x: "70%",
          y: "25%",
          orient: "vertical",
          left: "left",
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false, //禁止点击
          textStyle: {
            fontSize: 12,
            color: "#999"
          },
          formatter: function(name) {
            //避免文字太长做省略处理
            return name.length > 4 ? name.slice(0, 4) + "..." : name;
          },
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            center: ["55%", "60%"],
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            selectedMode: "single", //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
            selectedOffset: 5, //选中扇区的偏移距离
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: 12
                  },
                  /* formatter: '{b} : ({c}门) \n {d}%'	*/
                  formatter: function(params) {
                    //避免文字太长做省略处理
                    var name = params.name; //名字
                    var percent = params.percent; //占比
                    var value = params.value; //数量
                    if (name.length > 8) {
                      return (
                        name.slice(0, 7) +
                        "..." +
                        "\n" +
                        "(" +
                        value +
                        "道)" +
                        percent +
                        "%"
                      );
                    } else {
                      return name + "\n" + "(" + value + "道)" + percent + "%";
                    }
                  }
                },
                labelLine: {
                  show: true
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },

      showOrHidePop2: false,
      depTextColor: "#c0c4cc",

      echartBtn: true,
      echartOn: true,
      echartNum: 1,
      datas: [],
      deps: [],
      department: {
        id: "",
        departmentName: ""
      },
      startYear: "",
      endYear: "",
      departmentId: "",
      barData: []
    };
  },
  mounted: function() {
    // this.test();
  },
  created: function() {
    this.queryCoursePieChart();
    this.initData();
  },

  methods: {
    initData() {
      var _this = this;
      this.getRequest("/system/user/basicdata").then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.deps = data.deps;
        }
      });
    },
    handleNodeClick2(data) {
      this.department.departmentName = data.name;
      this.departmentId = data.id;
      this.showOrHidePop2 = false;
      this.depTextColor = "#606266";
    },
    showDepTree2() {
      this.showOrHidePop2 = !this.showOrHidePop2;
    },
    sum(array) {
      let sum = 0;
      array.forEach(ele => {
        sum += ele.value;
      });
      return sum;
    },
    queryCoursePieChart() {
      var _this = this;
      if (this.startYear != "") {
        this.startYear = this.startYear.getFullYear();
      }
      if (this.endYear != "") {
        this.endYear = this.endYear.getFullYear();
      }

      this.getRequest(
        "/data/?startYear=" +
          this.startYear +
          "&endYear=" +
          this.endYear +
          "&departmentId=" +
          this.departmentId
      ).then(async resp => {
        if (resp && resp.status == 200) {
          this.startYear = "";
          this.endYear = "";
          this.datas = resp.data.obj;
          let chart = this.datas;
          let d = this.datas[0].data;

          console.log(JSON.stringify(d));
          console.log(d);
          this.pipelineOption.xAxis[0].data = [];
          this.pipelineOption.series[0].data = [];
          d.forEach(v => {
            this.pipelineOption.xAxis[0].data.push(v.name);
            this.pipelineOption.series[0].data.push(v.value);
          });
          this.pipelineOption.title.subtext = "按管线分类";
          this.pipelineOption.title.subtext +=
            "，共" + d.length + "类" + this.sum(d) + "道";

          this.barData = d;

          // 装数据
          // if (this.datas.length == 6) {
          //   document.getElementById(
          //     "companyDefect"
          //   ).parentNode.parentNode.style.display = "none";
     
          // }
          // if (this.datas.length > 6) {
          //   document.getElementById(
          //     "companyDefect"
          //   ).parentNode.parentNode.style.display = "inline-block";
          //   let d6 = this.datas[6].data;
          //   this.companyDefect.series[0].data = d6;
          //   this.companyDefect.title.subtext =
          //     this.companyDefect.title.subtext +
          //     "，共" +
          //     d6.length +
          //     "类" +
          //     this.sum(d6) +
          //     "道";
          //   d6.forEach(element => {
          //     this.companyDefect.legend.data.push(element.name);
          //   });

          // }
          //初始化
          await this.drawLine();
          await this.test();
        }
      });
    },

    test() {
      console.log("数据长度" + this.datas.length);
      let _this = this;
      for (let i = 0; i < this.datas.length; i++) {
        let ds = this.datas[i].data;
        let chart = _this.chartComponent;
        chart.series[0].data = ds;
        chart.title.subtext =
          this.datas[i].title + "，共" + ds.length + "类" + this.sum(ds) + "道";
        chart.title.text = this.datas[i].detail;
        ds.forEach(element => {
          chart.legend.data.push(element.name);
        });
        let id = "chartComponent" + i;

        let echartOne = echarts.init(document.getElementById(id));
        echartOne.setOption(chart);

        chart = "";
        // 给图形添加点击事件
        let self = this;
        echartOne.on("click", function(params) {
          let p = params.data.query;
          if (self.departmentId != "") {
            p = p + "&departmentId=" + self.departmentId;
          }

          self.$router.push({
            path: "/sys/init",
            query: { param: p }
          });
        });
      }
    },
    drawLine: function() {
      // 初始化echarts实例
      //获取demo元素

      let pipelineOption = echarts.init(
        document.getElementById("pipelineOption")
      );

      //初始化echarts

      pipelineOption.setOption(this.pipelineOption);

      /**
       * 使用getZr添加图表的整个canvas区域的点击事件，并获取params携带的信息：
       *    this.echart.getZr().on('click',params=>{})
       * 获取到鼠标点击位置：
       *    const pointInPixel= [params.offsetX, params.offsetY];
       * 使用containPixel API判断点击位置是否在显示图形区域，下面的例子过滤了绘制图形的网格外的点击事件，比如X、Y轴lable、空白位置等的点击事件。
       *    if (this.echart.containPixel('grid',pointInPixel)) {}
       * 使用API convertFromPixel获取点击位置对应的x轴数据的索引值，我的实现是借助于索引值的，当然可以获取到其它的信息，详细请查看文档。
       *    let xIndex=this.echart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
       * 其实在上一步骤中可以获取到丰富的诸如轴线、索引、ID等信息，可以在自己的事件处理代码中方便的使用。
       * 这种方法仅响应图表区域的响应事件，通过convertFromPixel获取到可能需要的一些信息，可以很好的实现需求，并且不会有其它的性能影响，完美实现了如题的需求。
       */
      let self = this;
      pipelineOption.getZr().on("click", params => {
        const pointInPixel = [params.offsetX, params.offsetY];
        console.log(pointInPixel);
        console.log(params);

        if (pipelineOption.containPixel("grid", pointInPixel)) {
          let xIndex = pipelineOption.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[0];
          console.log(xIndex);
          let data = self.barData[xIndex].query;
          // let s = data.split("=")[1];
          // let p = params.data.query;
          if (self.departmentId != "") {
            data = data + "&departmentId=" + self.departmentId;
          }

          self.$router.push({
            path: "/sys/init",
            query: { param: data }
          });
        }
      });
    }
  }
};
</script>
