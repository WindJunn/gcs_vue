<template>
  <!-- <div style="width:100%;height: 100%;    display: flex;
    justify-content: center; flex-wrap: wrap;">
    <v-chart :options="polar" />
    <v-chart :options="polar" />

    <v-chart :options="polar" />

    <v-chart :options="polar" />
  </div>-->
  <!-- <div class="echarts-content"> -->
  <!-- <div class="chart-head">
      <p @click="echartShow">
        <strong id="strong">课程分布图</strong>
        <em v-if="echartBtn==false">（部门统计，岗位统计，人员统计，分类统计，类型统计）</em>
        <i :class="{'el-icon-arrow-down':echartBtn==false,'el-icon-arrow-up':echartBtn}"></i>
      </p>
  </div>-->
  <!-- <div class="chart-main" id="chart-main"> -->
  <!-- <div id="fileTypeChart" :style="{width: '48%', height: '215px'}"></div> -->
  <!-- <div class="chart-main-right">
        <el-tooltip class="item" effect="dark" content="部门，岗位" placement="right">
          <span :class="{spanActive:echartNum==1}" @click="echartIsShow('1')"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="人员，分类" placement="right">
          <span :class="{spanActive:echartNum==2}" @click="echartIsShow('2')"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="类型" placement="right">
          <span :class="{spanActive:echartNum==3}" @click="echartIsShow('3')"></span>
        </el-tooltip>
  </div>-->
  <div
    style="width:100%;height: 100%; margin-top:30px;   display: flex;
    justify-content: center; flex-wrap: wrap;"
  >
    <div
      id="departmentChart"
      :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"
    ></div>
    <div id="postChart" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
    <div id="personnelChart" :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"></div>
    <div id="classifyChart" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
  </div>
</template>

<style>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
  width: 40%;
  height: 25%;
}
.echarts-content {
  width: 100%;
  min-height: 78px;
  max-height: 300px;
  background: #fff;
  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 0 30px;
}
.echarts-content .chart-head {
  height: 78px;
  width: 100%;
  padding-top: 30px;
}
.echarts-content .chart-head p {
  display: inline-block;
  height: 21px;
  width: 100%;
  cursor: pointer;
  text-align: center;
}
.echarts-content .chart-head p strong {
  font-weight: normal;
  font-size: 16px;
  color: #999;
}
.echarts-content .chart-head p em {
  display: inline-block;
  font-style: normal;
  font-size: 14px;
  color: #999;
}
.echarts-content .chart-head p i {
  display: inline-block;
  color: #e4e4e4;
  font-size: 14px;
  margin-left: 10px;
}

.echarts-content .chart-main {
  width: 100%;
  height: 222px;
  position: relative;
  overflow: hidden;
  -webkit-transition: height 0.6s;
  -moz-transition: height 0.6s;
  -o-transition: height 0.6s;
  transition: height 0.6s;
}
.echarts-content .chart-main .chart-main-left {
  width: calc(100% - 20px);
  height: 100%;
  float: left;
}
.echarts-content .chart-main .chart-main-right {
  width: 20px;
  height: 100%;
  float: right;
  padding-top: 50px;
}
.echarts-content .chart-main .chart-main-right span {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #e4e4e4;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  cursor: pointer;
}
.echarts-content .chart-main .chart-main-right span:hover {
  background: #0188fd;
}
.echarts-content .chart-main .chart-main-right .spanActive {
  background: #0188fd;
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
// 引入提示框和图例组件
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll");
export default {
  data() {
    return {
      departmentOption: {
        title: {
          text: "分公司",
          subtext: "",
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
            radius: "75%",
            center: ["60%", "54%"],
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
        ],
        color: [
          "rgb(187,140,238)",
          "rgb(134,146,243)",
          "rgb(60,184,255)",
          "rgb(113,171,246)",
          "rgb(255,193,134)"
        ] //饼图分块颜色设置
      },
      postChartOption: {
        title: {
          text: "安全评价结果",
          subtext: "",
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
            return name.length > 4 ? name.slice(0, 4) + "..." : name;
          },
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "75%",
            center: ["60%", "54%"],
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            selectedMode: "single", //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
            selectedOffset: 5, //选中扇区的偏移距离
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(params) {
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
        ],
        color: [
          "rgb(187,140,238)",
          "rgb(134,146,243)",
          "rgb(60,184,255)",
          "rgb(113,171,246)",
          "rgb(255,193,134)"
        ]
      },
      personnelChartOption: {
        title: {
          text: "处置方式",
          subtext: "",
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
            return name.length > 4 ? name.slice(0, 4) + "..." : name;
          },
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "75%",
            center: ["60%", "54%"],
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            selectedMode: "single", //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
            selectedOffset: 5, //选中扇区的偏移距离
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(params) {
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
        ],
        color: [
          "rgb(187,140,238)",
          "rgb(134,146,243)",
          "rgb(60,184,255)",
          "rgb(113,171,246)",
          "rgb(255,193,134)"
        ]
      },
      classifyChartOption: {
        title: {
          text: "管线分类",
          subtext: "",
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
            return name.length > 4 ? name.slice(0, 4) + "..." : name;
          },
          data: []
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "75%",
            center: ["60%", "54%"],
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            selectedMode: "single", //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
            selectedOffset: 5, //选中扇区的偏移距离
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(params) {
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
        ],
        color: [
          "rgb(187,140,238)",
          "rgb(134,146,243)",
          "rgb(60,184,255)",
          "rgb(113,171,246)",
          "rgb(255,193,134)"
        ]
      },
      // fileTypeChartOption: {
      //   title: {
      //     text: "类型统计",
      //     subtext: "",
      //     x: "left",
      //     textStyle: {
      //       color: "#222",
      //       fontStyle: "normal",
      //       fontWeight: "600",
      //       fontFamily: "san-serif",
      //       fontSize: 16
      //     }
      //   },
      //   tooltip: {
      //     trigger: "item",
      //     formatter: "{a} {b} : ({c}道) {d}%"
      //   },
      //   legend: {
      //     x: "70%",
      //     y: "25%",
      //     orient: "vertical",
      //     left: "left",
      //     itemWidth: 10,
      //     itemHeight: 10,
      //     selectedMode: false, //禁止点击
      //     textStyle: {
      //       fontSize: 12,
      //       color: "#999"
      //     },
      //     formatter: function(name) {
      //       return name.length > 4 ? name.slice(0, 4) + "..." : name;
      //     },
      //     data: []
      //   },
      //   series: [
      //     {
      //       name: "",
      //       type: "pie",
      //       radius: "75%",
      //       center: ["50%", "54%"],
      //       hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
      //       selectedMode: "single", //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
      //       selectedOffset: 5, //选中扇区的偏移距离
      //       data: [],
      //       itemStyle: {
      //         normal: {
      //           label: {
      //             show: true,
      //             formatter: function(params) {
      //               var name = params.name; //名字
      //               var percent = params.percent; //占比
      //               var value = params.value; //数量
      //               if (name.length > 8) {
      //                 return (
      //                   name.slice(0, 7) +
      //                   "..." +
      //                   "\n" +
      //                   "(" +
      //                   value +
      //                   "道)" +
      //                   percent +
      //                   "%"
      //                 );
      //               } else {
      //                 return name + "\n" + "(" + value + "道)" + percent + "%";
      //               }
      //             }
      //           },
      //           labelLine: {
      //             show: true
      //           }
      //         },
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: "rgba(0, 0, 0, 0.5)"
      //         }
      //       }
      //     }
      //   ],
      //   color: [
      //     "rgb(187,140,238)",
      //     "rgb(134,146,243)",
      //     "rgb(60,184,255)",
      //     "rgb(113,171,246)",
      //     "rgb(255,193,134)"
      //   ]
      // },

      echartBtn: true,
      echartOn: true,
      echartNum: 1
    };
  },
  mounted: function() {
    this.queryCoursePieChart();
  },
  methods: {
    queryCoursePieChart: function() {
      /*****************部门统计****************/
      this.departmentOption.series[0].data = [
        { value: 5, name: "独山子" },
        { value: 30, name: "乌输" },
        { value: 23, name: "新疆" },
        { value: 13, name: "塔输" },
        { value: 154, name: "酒泉" },
        { value: 1, name: "甘肃" },
        { value: 15, name: "兰州" }
      ];
      this.departmentOption.legend.data = [
        "独山子",
        "乌输",
        "新疆",
        "塔输",
        "酒泉",
        "甘肃",
        "兰州"
      ];

      /*****************岗位统计****************/
      this.postChartOption.series[0].data = [
        { value: 2, name: "不可接受" },
        { value: 263, name: "可接受" }
      ];
      this.postChartOption.legend.data = ["不可接受", "可接受"];

      /*****************人员统计****************/
      this.personnelChartOption.series[0].data = [
        { value: 10, name: "打磨" },
        { value: 30, name: "复检" },
        { value: 12, name: "套筒或复合材料修复" },
        { value: 12, name: "B套修复或换管处理" }
      ];
      this.personnelChartOption.legend.data = [
        "打磨",
        "复检",
        "套筒或复合材料修复",
        "B套修复或换管处理"
      ];
      /*****************课程分类****************/
      this.classifyChartOption.series[0].data = [
        { value: 10, name: "打磨" },
        { value: 30, name: "复检" },
        { value: 12, name: "套筒或复合材料修复" },
        { value: 12, name: "B套修复或换管处理" },
        { value: 201, name: "按普通焊缝管处理" }
      ];
      this.classifyChartOption.legend.data = [
        "打磨",
        "复检",
        "套筒或复合材料修复",
        "B套修复或换管处理",
        "按普通焊缝管处理"
      ];
      /*****************文件类型****************/
      // this.fileTypeChartOption.series[0].data = [1, 2, 3, 4, 5];
      // this.fileTypeChartOption.legend.data = [1, 2, 3, 4, 5];

      //初始化
      this.drawLine();
      // this.getRequest(
      // 	this.api.queryCoursePieChart, {
      // 		params:{
      // 			access_token:localStorage.token
      // 		}
      // 	}, {
      // 		emulateJSON: true
      // 	}
      // ).then(function(data) {
      // 	if(data.body.code == 801) {
      // 		localStorage.token = null
      // 		this.$router.push({
      // 			path: '/index-auth-login',
      // 			query: {
      // 				'redirect': this.$route.query.fullPath
      // 			}
      // 		})
      // 		return false;
      // 	}

      // 	/*****************部门统计****************/
      // 	this.departmentOption.series[0].data=data.body.data.courseCountUsers1.list;
      // 	this.departmentOption.legend.data=data.body.data.courseCountUsers1.names.split(',');

      // 	/*****************岗位统计****************/
      // 	this.postChartOption.series[0].data=data.body.data.courseCountUsers2.list;
      // 	this.postChartOption.legend.data=data.body.data.courseCountUsers2.names.split(',');

      // 	/*****************人员统计****************/
      // 	this.personnelChartOption.series[0].data=data.body.data.courseCountUsers3.list;
      // 	this.personnelChartOption.legend.data=data.body.data.courseCountUsers3.names.split(',');
      // 	/*****************课程分类****************/
      // 	this.classifyChartOption.series[0].data=data.body.data.courseCountUsers4.list;
      // 	this.classifyChartOption.legend.data=data.body.data.courseCountUsers4.names.split(',');
      // 	/*****************文件类型****************/
      // 	this.fileTypeChartOption.series[0].data=data.body.data.courseCountUsers5.list;
      // 	this.fileTypeChartOption.legend.data=data.body.data.courseCountUsers5.names.split(',');

      // 	//初始化
      // 	this.drawLine();

      // }, function(err) {
      // 	this.$message.error('网络通讯错误')
      // });
    },
    drawLine: function() {
      // 初始化echarts实例
      //获取demo元素
      let departmentChart = echarts.init(
        document.getElementById("departmentChart")
      );
      let postChart = echarts.init(document.getElementById("postChart"));
      let personnelChart = echarts.init(
        document.getElementById("personnelChart")
      );
      let classifyChart = echarts.init(
        document.getElementById("classifyChart")
      );
      // let fileTypeChart = echarts.init(
      //   document.getElementById("fileTypeChart")
      // );

      //初始化echarts
      departmentChart.setOption(this.departmentOption);
      postChart.setOption(this.postChartOption);
      personnelChart.setOption(this.personnelChartOption);
      classifyChart.setOption(this.classifyChartOption);
      // fileTypeChart.setOption(this.fileTypeChartOption);
    },
    echartShow: function() {
      //图表展示隐藏
      let chartMain = document.getElementById("chart-main");
      let strong = document.getElementById("strong");
      if (this.echartOn) {
        this.echartBtn = false;
      } else {
        this.echartBtn = true;
      }
      //显示隐藏上下滑动效果
      chartMain.style.height = this.echartOn ? "0" : "215px";
      strong.style.color = this.echartOn ? "#222" : "#999";
      this.echartOn = !this.echartOn;
    },
    echartIsShow: function(n) {
      //不同图表切换
      this.echartNum = n;
    }
  }
};
</script>