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
    <div id="pipelineDefect" :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"></div>
    <div id="pipelineDefectNo" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
    <div
      id="pipelineDefectFix"
      :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"
    ></div>
    <div id="totalResult" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
    <div id="totalAdvices" :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"></div>
    <div id="totalAdvice" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
    <div id="companyDefect" :style="{width: '48%', height: '30%',borderRight:'1px solid #e4e4e4'}"></div>
    <div id="companyDefectNo" :style="{width: '48%', height: '30%',marginLeft:'30px'}"></div>
    <div id="companyDefectFix" :style="{width: '48%', height: '30%'}"></div>
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
      
      pipelineDefect: {
        title: {
          text: "不同管线超标缺陷",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      pipelineDefectNo: {
        title: {
          text: "不同管线缺陷评价不可接受",
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
        ]
      },
      pipelineDefectFix: {
        title: {
          text: "不同管线缺陷评价需处置",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      totalResult: {
        title: {
          text: "适用性评价结果",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      totalAdvices: {
        title: {
          text: "是否需处置",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      totalAdvice: {
        title: {
          text: "处置详情",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      companyDefect: {
        title: {
          text: "各公司超标缺陷",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      companyDefectNo: {
        title: {
          text: "各公司缺陷评价不可接受",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
      companyDefectFix: {
        title: {
          text: "各公司缺陷评价需处置",
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
        ]
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
      },
    

      echartBtn: true,
      echartOn: true,
      echartNum: 1,
      datas: []
    };
  },
  mounted: function() {
    this.queryCoursePieChart();
  },
  methods: {
    queryCoursePieChart: function() {
      var _this = this;
      this.getRequest("/data/").then(resp => {
        if (resp && resp.status == 200) {
          this.datas = resp.data.obj;
          let d = this.datas[0].data;
          let d1 = this.datas[1].data;
          let d2 = this.datas[2].data;
          let d3 = this.datas[3].data;
          let d4 = this.datas[4].data;
          let d5 = this.datas[5].data;
          let d6 = this.datas[6].data;
          let d7 = this.datas[7].data;
          let d8 = this.datas[8].data;

          this.pipelineDefect.series[0].data = d;
          d.forEach(element => {
            this.pipelineDefect.legend.data.push(element.name);
          });

          this.pipelineDefectNo.series[0].data = d1;
          d1.forEach(element => {
            this.pipelineDefectNo.legend.data.push(element.name);
          });
          this.pipelineDefectFix.series[0].data = d2;
          d2.forEach(element => {
            this.pipelineDefectFix.legend.data.push(element.name);
          });
          this.totalResult.series[0].data = d3;
          d3.forEach(element => {
            this.totalResult.legend.data.push(element.name);
          });
          this.totalAdvices.series[0].data = d4;
          d4.forEach(element => {
            this.totalAdvices.legend.data.push(element.name);
          });
          this.totalAdvice.series[0].data = d5;
          d5.forEach(element => {
            this.totalAdvice.legend.data.push(element.name);
          });
          this.companyDefect.series[0].data = d6;
          d6.forEach(element => {
            this.companyDefect.legend.data.push(element.name);
          });
          this.companyDefectNo.series[0].data = d7;
          d7.forEach(element => {
            this.companyDefectNo.legend.data.push(element.name);
          });
          this.companyDefectFix.series[0].data = d8;
          d8.forEach(element => {
            this.companyDefectFix.legend.data.push(element.name);
          });

          //初始化
          this.drawLine();
        }
      });
     
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

      // }, function(err) {
      // 	this.$message.error('网络通讯错误')
      // });
    },
    drawLine: function() {
      // 初始化echarts实例
      //获取demo元素
      let pipelineDefect = echarts.init(
        document.getElementById("pipelineDefect")
      );
      let pipelineDefectNo = echarts.init(
        document.getElementById("pipelineDefectNo")
      );
      let pipelineDefectFix = echarts.init(
        document.getElementById("pipelineDefectFix")
      );
      let totalResult = echarts.init(document.getElementById("totalResult"));
      let totalAdvices = echarts.init(document.getElementById("totalAdvices"));
      let totalAdvice = echarts.init(document.getElementById("totalAdvice"));
      let companyDefect = echarts.init(
        document.getElementById("companyDefect")
      );
      let companyDefectNo = echarts.init(
        document.getElementById("companyDefectNo")
      );
      let companyDefectFix = echarts.init(
        document.getElementById("companyDefectFix")
      );

      //初始化echarts
      pipelineDefect.setOption(this.pipelineDefect);
      let self = this;

      pipelineDefect.on("click", function(params) {
        let s = params.data.query.split("=")[2];
        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, pipelineName: s }
        });
      });

      pipelineDefectNo.setOption(this.pipelineDefectNo);
      pipelineDefectNo.on("click", function(params) {
        let s = params.data.query.split("=")[3];

        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, evaluationResultId: 2, pipelineName: s }
        });
      });
      pipelineDefectFix.setOption(this.pipelineDefectFix);
      pipelineDefectFix.on("click", function(params) {
        let s = params.data.query.split("=")[3];
        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, disposalAdviceIdNo: 1, pipelineName: s }
        });
      });
      totalResult.setOption(this.totalResult);
      totalResult.on("click", function(params) {
        let s = params.data.query.split("=")[1];
        self.$router.push({
          path: "/sys/init",
          query: { evaluationResultId: s }
        });
      });
      totalAdvices.setOption(this.totalAdvices);
      totalAdvices.on("click", function(params) {
        let s = params.data.query.split("=")[1];
        let q = params.data.query.split("=")[0].split("&")[1];
        if (q == "disposalAdviceId") {
          self.$router.push({
            path: "/sys/init",
            query: { disposalAdviceId: s }
          });
        }
        if (q == "disposalAdviceIdNo") {
          self.$router.push({
            path: "/sys/init",
            query: { disposalAdviceIdNo: s }
          });
        }
      });

      totalAdvice.setOption(this.totalAdvice);
      totalAdvice.on("click", function(params) {
        let s = params.data.query.split("=")[1];
        self.$router.push({
          path: "/sys/init",
          query: { disposalAdviceId: s }
        });
      });
      companyDefect.setOption(this.companyDefect);
      companyDefect.on("click", function(params) {
        let s = params.data.query.split("=")[2];
        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, departmentId: s }
        });
      });
      companyDefectNo.setOption(this.companyDefectNo);
      companyDefectNo.on("click", function(params) {
        let s = params.data.query.split("=")[3];
        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, evaluationResultId: 2, departmentId: s }
        });
      });
      companyDefectFix.setOption(this.companyDefectFix);
      companyDefectFix.on("click", function(params) {
        let s = params.data.query.split("=")[3];
        self.$router.push({
          path: "/sys/init",
          query: { defectId: 1, disposalAdviceIdNo: 1, departmentId: s }
        });
      });
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