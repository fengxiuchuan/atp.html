<template>
    <section>
       <!--树形控件-->
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <el-tree
                style="margin-top: 10px;"
                height="28px"
                :data="data2"
                :props="defaultProps"
                node-key="id"
                highlight-current
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" style="margin:5px;height:20px;" slot-scope="{ node, data }">
                <span><el-input type="text" style="width:100px;heght:18px" size="small" :readonly="data.readOnly" v-model="data.name"  placeholder="请输入名称"></el-input></span>
                <span><el-input type="text" style="width:200px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.url" placeholder="url"></el-input></span>
                <span><el-input type="text" style="width:120px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.path" placeholder="path"></el-input></span>
                <span><el-input type="text" style="width:100px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.iconCls" placeholder="iconCls"></el-input></span>
                <span style="width:80px" >
                    <label>是否授权</label>
                    <el-switch
                      v-model="data.requireAuth"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value=""
                      inactive-value="0">
                    </el-switch>
                </span>
                <span style="width:30px" >
                    <label>是否有效</label>
                    <el-switch
                      v-model="data.enabled"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value=""
                      inactive-value="0">
                    </el-switch></span>
                  <span style="width:30px" >
                    <el-select   size="small"  v-model="data.menuType"  placeholder="请选择" >
                        <el-option
                        v-for="item in menuTypeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" >
                        </el-option>
                    </el-select>
                  </span>
                  <span style="width:30px" >
                   <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data,'')">
                      新增同级
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data,'children')">
                      新增下级
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                    <el-button
                      v-if="data.id == -1"
                      type="text"
                      size="mini"
                      @click="() => saveNode(data)">
                      保存更新
                    </el-button>
                  </span>
                </span>
            </el-tree>
      
        
        
    </section>
</template>
<script>
import TreeRender from '../components/Tree_render'
import {urlAddMenu,urlEditMenu,urlDelMenu,urlQueryMenuTree} from "../api/req_menu";
export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data:function() {
      const data2 =   [
        {
            id: 1,
            name:"一级",
            url:"/user/cc",
            path:"user",
            iconCls:"icon-user",
            requireAuth:"",
            requireAuth:true,
            enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
            parentId: '',
            inEdit:false,
            children: [{
              id: 4,
              name:"二级-1级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
              inEdit:false,
              children:[]
            },{
              id: 5,
              name:"二级 2-2级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
              inEdit:false,
              children:[]
            }, {
              id: 6,
              name:"二级-1级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
              inEdit:false,
              children:[]
            },]
          }];

        const nodeObj = {
              id:"",
              name:"",
              url:"",
              path:"",
              iconCls:"",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '',
              inEdit:true
        }
      return {
        filterText: '',
        data2:JSON.parse(JSON.stringify(data2)),
        menuTypeArr:[
          {label:"菜单",value:"menu"},
          {label:"按钮",value:"btn"}
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        /*新增事件弹窗的输入框数据*/
        addEventdialogVisible: false,
        addEventForm:{
            categoryName: '',
            categoryFlag: '',
        },
        addEventNodeRules:[]
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      append(data,type) {
         const newNode = nodeObj;
        if(type == 'children'){
          newNode.parentId = data.id;
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newNode);
        }else{
          newNode.id = data.id;
          newNode.parentId = data.parentId;
          data.push(newNode);
        }
       
        
      },

      remove(node, data) {
        const parent = node.parent;
        const curId = data.id;
        if(!curId){
          this.$refs[this.formNameObj.addForm].validate((valid) => {
          if(valid){
              this.$confirm(confirmTxt,'确认删除本级和所属资源么？',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info '
              }).then(() => {
                
                let para = {id:data.id}
                this.$http.delete(urlDelMenu, para, res => {
                  this.addLoading = false;
                  if(res && res.data && 'A_SYS_00010' === res.data.code){
                      this.$message({
                        message: res.data.msg,
                        type: 'success'
                      });
                      const children = parent.data.children || parent.data;
                      const index = children.findIndex(d => d.id === data.id);
                      children.splice(index, 1);
                   }else{
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }

                });
              })
          }
			})
      }else{
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      }
        
      },
      saveNode(data){
          let para = Object.assign({},data);
          this.$http.post(urlDelMenu, para, res => {
            this.addLoading = false;
            if(res && res.data && 'A_SYS_00010' === res.data.code){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                data.id = res.data.data.id;
                data.inEdit = false;
              }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          });
      }
    },
    components:{
      "TreeRender":TreeRender
    }
  };
</script>
