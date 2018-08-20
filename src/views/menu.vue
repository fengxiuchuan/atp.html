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
                <span><el-input type="text" style="width:120px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.url" placeholder="url"></el-input></span>
                <span><el-input type="text" style="width:120px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.path" placeholder="path"></el-input></span>
                <span><el-input type="text" style="width:120px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.component" placeholder="component"></el-input></span>
                <span><el-input type="text" style="width:100px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.iconCls" placeholder="iconCls"></el-input></span>
                <span style="width:30px" >
                  
                    <label>状态</label>
                    <el-switch
                      v-model="data.state"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                    </span>
                  <span  >
                    <el-select style="width:100px"  size="small"  v-model="data.menuType"  placeholder="请选择" >
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
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                    <el-button
                      v-if="!data.inEdit"
                      type="text"
                      size="mini"
                      @click="() => handlEdit(data)">
                      编辑
                    </el-button>
                    <el-button
                      v-if="data.inEdit"
                      type="text"
                      size="mini"
                      @click="() => saveNode(data)">
                      保存更新
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data,node,'')">
                      新增同级
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data,node,'children')">
                      新增下级
                    </el-button>
                  </span>
                </span>
            </el-tree>
      
        
        
    </section>
</template>
<script>
import TreeRender from '../components/Tree_render'
import {urlAddMenu,urlEditMenu,urlDelMenu,urlQueryMenuTree} from "../api/req_menu";
let serial = 10000
export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data:function() {
      return {
        filterText: '',
        data2:[],
        menuTypeArr:[
          {label:"模块",value:"module"},
          {label:"菜单",value:"menu"},
          {label:"按钮",value:"btn"}
        ],
        initRoot:[
          {
              id:0,
              name:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:true,  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: -1,
              inEdit:true,
              level:1,
              component:'',
              sort:'',
              children:[]
        }
        ],
        nodeObj:{
              id:"",
              name:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:true,  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '',
              inEdit:true,
              component:'',
               sort:'',
              children:[]
        },
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
      handlEdit(data){
         this.$set(data, 'inEdit', true);
      },
      append(data,node,type) {
         let parentId = data.parentId;
         if(data.id >= 10000 || data.id == 0 || data.id == -1){
             this.$message({
                message:"请先保存当前菜单",
                type: 'warning'
              });
            return;
         }
         let level = data.level;
         const newNode = {
              id:-1,
              name:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:true,  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '',
              inEdit:true,
              level:-1,
              component:'',
              sort:'',
              children:[]
        };
        serial = serial + 1
        newNode.id = serial;
        if(type == 'children'){
          newNode.parentId = data.id;
          newNode.level = (data.level ? data.level : 1) + 1
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newNode);
        }else{
         
          newNode.parentId = data.parentId;
          newNode.level = data.level;
          if(level == 1){
            this.data2.push(newNode);
          }else{
            node.parent.data.children.push(newNode)
          }
        }
       
        
      },

      remove(node, data) {
        const parent = node.parent;
        const curId = data.id;
        const parentId = data.parentId;
        const children  = data.children;
        if(children && children.length > 0){
             this.$message({
                message:"该节点存在下级资源，不能删除！",
                type: 'warning'
              });
          return;
        }

        if(curId && curId < 10000){
         
              this.$confirm('确认删除本级和所属资源么？',{
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
        
        }else{
          
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          
        }
        
      },
      getMenuTree:function(){
         this.$http.post(urlQueryMenuTree, {}, res => {
            this.addLoading = false;
            if(res && res.data && 'A_SYS_00010' === res.data.code && res.data.data.length > 0){
                this.data2 = res.data.data;
              }else{
                this.data2 = this.initRoot;
            }
        });
      },
      saveNode(data){
          if(data.id > 10000){
            data.id = -1
          }
          let submitUrl = urlAddMenu;
          if(data.id && data.id < 10000 && data.id != -1){
            submitUrl = urlEditMenu;
          }
          
          let para = Object.assign({},data)
        
          this.$http.post(submitUrl, para, res => {
            this.addLoading = false;
            if(res && res.data && 'A_SYS_00010' === res.data.code){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.$set(data,id,res.data.data.id);
                 this.$set(data,inEdit,false);
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
            }

          });
      }
    },
    mounted(){
      this.getMenuTree();
    },
    components:{
      "TreeRender":TreeRender
    }
  };
</script>
