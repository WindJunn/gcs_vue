<template>
  <!-- <div class="echarts-content"> -->
  <el-row>
    <div class="echarts-input">
      <el-col :span="5">
        <el-tag>年份:</el-tag>
        <el-input v-model="startYear" style="margin-left:5px" size="mini"></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
        <el-input v-model="endYear" size="mini"></el-input>
      </el-col>
      <el-col :span="10">
        <el-tag>所属公司:</el-tag>
        <el-popover
          v-model="showOrHidePop2"
          placement="right"
          title="请选择公司"
          trigger="manual"
          style="width:250px"
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
            style="width: 250px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
            @click="showDepTree2"
            v-bind:style="{color: depTextColor}"
          >{{department.departmentName}}</div>
        </el-popover>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 5px"
          icon="el-icon-search"
          @click="queryCoursePieChart()"
        >搜索</el-button>
      </el-col>
    </div>

    <el-col :span="24">
      <div class="echarts-box1">
        <div id="pipelineDefect" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="pipelineDefectNo" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="pipelineDefectFix" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="totalResult" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="totalAdvices" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="totalAdvice" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="companyDefect" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="companyDefectNo" class="echarts"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="echarts-box">
        <div id="companyDefectFix" class="echarts"></div>
      </div>
    </el-col>
    <!-- <div id="totalResult" :style="{width: '48%', height: '160px',marginLeft:'30px'}"></div> -->
    <!-- <div id="totalAdvices" :style="{width: '48%', height: '160px',borderRight:'1px solid #e4e4e4'}"></div> -->
    <!-- <div id="totalAdvice" :style="{width: '48%', height: '160px',marginLeft:'30px'}"></div> -->
    <!-- <div
      id="companyDefect"
      :style="{width: '48%', height: '160px',borderRight:'1px solid #e4e4e4'}"
    ></div>-->
    <!-- <div id="companyDefectNo" :style="{width: '48%', height: '160px',marginLeft:'30px'}"></div> -->
    <!-- <div id="companyDefectFix" :style="{width: '48%', height: '160px'}"></div> -->
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
  width: 100%;
  height: 40px;
  margin: 30px 0;
  box-shadow: 1px 1px 10px #6d83f1;
  padding: 10px 10px 10px 10px;
  border-radius: 15px;
}
.echarts-input .el-col-5 {
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
      pipelineDefect: {
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
        tooltip: {
          trigger: "item",
          /* formatter: "{a} <br/>{b} : ({c}道) {d}%"*/
          formatter: "{a} {b} : ({c}道) {d}%"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        // toolbox: {//工具栏,内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
        //     feature: {//各工具配置项。
        //         dataView: {//数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
        //             show: true,//是否显示组件。
        //             readOnly: false
        //         },
        //         magicType:{//动态类型切换 示例：feature: { magicType: {type: ['line', 'bar', 'stack', 'tiled']}}
        //             show:true,
        //             type:['line','bar']
        //         },
        //         restore: {//配置项还原。
        //             show: true
        //         },
        //         saveAsImage: {//保存为图片。
        //             show: true,
        //             type:["jpg","png"]
        //         }
        //     }
        // },
        // legend: {
        //   x: "70%",
        //   y: "25%",
        //   orient: "vertical",
        //   left: "left",
        //   itemWidth: 10,
        //   itemHeight: 10,
        //   selectedMode: false, //禁止点击
        //   textStyle: {
        //     fontSize: 12,
        //     color: "#999"
        //   },
        //   formatter: function(name) {
        //     //避免文字太长做省略处理
        //     return name.length > 4 ? name.slice(0, 4) + "..." : name;
        //   },
        //   data: []
        // },
        series: [
          {
            name: "",
            type: "pie",
            radius: "30%",
            center: ["50%", "50%"],
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
                      return name + "" + "(" + value + "道)" + percent + "%";
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
          text: "不同管线环焊缝不可接受数量",
          subtext: "按管线分类",
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
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
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
      pipelineDefectFix: {
        title: {
          text: "不同管线环焊缝需处置数量",
          subtext: "按管线分类",
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
          text: "适用性评价结果数量",
          subtext: "按评价总数分类",
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
          text: "是否需处置数量",
          subtext: "按评价总数分类",
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
          text: "处置详情数量",
          subtext: "按评价总数分类",
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
          text: "各公司环焊缝数量",
          subtext: "按公司分类",
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
          text: "各公司环焊缝不可接受数量",
          subtext: "按公司分类",
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
          text: "各公司环焊缝需处置数量",
          subtext: "按公司分类",
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
        // color: [
        //   "rgb(187,140,238)",
        //   "rgb(134,146,243)",
        //   "rgb(60,184,255)",
        //   "rgb(113,171,246)",
        //   "rgb(255,193,134)"
        // ] //饼图分块颜色设置
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
      departmentId: ""
    };
  },
  mounted: function() {
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
    queryCoursePieChart: function() {
      var _this = this;
      this.getRequest(
        "/data/?startYear=" +
          this.startYear +
          "&endYear=" +
          this.endYear +
          "&departmentId=" +
          this.departmentId
      ).then(resp => {
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
          console.log(JSON.stringify(d))

          this.pipelineDefect.series[0].data = d;
          d.forEach(element => {
            // this.pipelineDefect.legend.data.push(element.name);
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
        let s = params.data.query.split("=")[1];
        self.$router.push({
          path: "/sys/init",
          query: { pipelineName: s }
        });
      });

      pipelineDefectNo.setOption(this.pipelineDefectNo);
      pipelineDefectNo.on("click", function(params) {
        let s = params.data.query.split("=")[2];

        self.$router.push({
          path: "/sys/init",
          query: { evaluationResultId: 2, pipelineName: s }
        });
      });
      pipelineDefectFix.setOption(this.pipelineDefectFix);
      pipelineDefectFix.on("click", function(params) {
        let s = params.data.query.split("=")[2];
        self.$router.push({
          path: "/sys/init",
          query: { disposalAdviceIdNo: 1, pipelineName: s }
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
        let s = params.data.query.split("=")[1];
        self.$router.push({
          path: "/sys/init",
          query: { departmentId: s }
        });
      });
      companyDefectNo.setOption(this.companyDefectNo);
      companyDefectNo.on("click", function(params) {
        let s = params.data.query.split("=")[2];
        self.$router.push({
          path: "/sys/init",
          query: { evaluationResultId: 2, departmentId: s }
        });
      });
      companyDefectFix.setOption(this.companyDefectFix);
      companyDefectFix.on("click", function(params) {
        let s = params.data.query.split("=")[2];
        self.$router.push({
          path: "/sys/init",
          query: { disposalAdviceIdNo: 1, departmentId: s }
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