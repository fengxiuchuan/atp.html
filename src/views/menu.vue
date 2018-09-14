<template>
    <section>
       <!--树形控件-->
            <el-col :span="8">
              <el-button type="primary" @click.native="addNode()">新增</el-button>	
            <el-tree :data="data2"
                :props="defaultProps"
                @node-click="handleNodeClick"
                >
            </el-tree>
      
            </el-col>
            <el-col :span="12">
              <el-form :model="menuForm" label-width="80px" :rules="menuRules" ref="menuForm" >
                  <el-input type="hidden" v-model="menuForm.parentId"></el-input>
                      <el-form-item label="上级菜单" >
                        {{menuForm.parentName == null ? "菜单" : menuForm.parentName}}
                      </el-form-item>
                
                      <el-form-item label="菜单名称" >
                        <el-input  v-model="menuForm.name" auto-complete="off"></el-input>
                      </el-form-item>
                  
                      <el-form-item label="URL" >
                        <el-input  v-model="menuForm.url" auto-complete="off"></el-input>
                      </el-form-item>
                   
                    
                      <el-form-item label="组件名称" >
                        <el-input  v-model="menuForm.component" auto-complete="off"></el-input>
                      </el-form-item>
                 
                      <el-form-item label="菜单路径" >
                        <el-input  v-model="menuForm.path" auto-complete="off"></el-input>
                      </el-form-item>
                   
                  
                   
                      <el-form-item label="图标样式" >
                        <el-input  v-model="menuForm.iconCls" auto-complete="off"></el-input>
                      </el-form-item>
                    
                  
                      <el-form-item label="状态" >
                        
                         <el-select v-model="menuForm.state" placeholder="请选择">
                          <el-option
                            v-for="item in stateArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                
                    
                      <el-form-item label="组件类型" >
                         <el-select v-model="menuForm.menuType" placeholder="请选择">
                          <el-option
                            v-for="item in menuTypeArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    
                  
                  <div slot="footer" class="dialog-footer">
                    <el-button @click.native="duSubmit()">确定</el-button>
                  </div>
                  
                  <el-form-item>
                        <el-col :span="24">
                            
                            <el-button type="primary" @click.native="duSubmit()" :loading="addLoading">提交</el-button>	
                        </el-col>
              </el-form-item>
                </el-form>
            </el-col>
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
        parentId:-1,
        parentName:"菜单",
        menuTypeArr:[
          {label:"模块",value:"module"},
          {label:"菜单",value:"menu"},
          {label:"按钮",value:"btn"}
        ],
        stateArr:[
          {label:"有效",value:"Y"},
          {label:"无效",value:"N"}
        ],
        initRoot:[
          {
              id:0,
              name:"",
              parentName:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:"Y",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: -1,
              inEdit:true,
              level:1,
              component:'',
              sort:'',
              children:[]
        }
        ],
        menuRules:{},
        menuForm:{
              id:"",
              name:"",
              parentName:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:"Y",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '',
              inEdit:true,
              component:'',
               sort:'',
              children:[]
        },
        nodeObj:{
              id:"",
              name:"",
              parentName:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:"Y",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
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
      addNode:function(){
        let node = this.nodeObj;
        node.parentId = this.parentId;
        node.parentName = this.parentName;
        this.menuForm = node;
      },
      handleNodeClick(data) {
        this.parentId = data.id;
        this.parentName = data.parentName;
        this.menuForm = Object.assign({},data)
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
              parentName:"",
              url:"",
              path:"",
              iconCls:"",
              keepAlive:true,
              requireAuth:true,
              state:"Y",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
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
      duSubmit(){
          let formSubmitURl = urlAddMenu;
          if(this.menuForm.id != '' && this.menuForm.id != null && this.menuForm.id != -1){
             formSubmitURl = urlEditMenu;
          }
          let para = Object.assign({},this.menuForm)
        
          this.$http.post(formSubmitURl, para, res => {
            this.addLoading = false;
            if(res && res.data && 'A_SYS_00010' === res.data.code){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                this.menuForm = this.nodeObj;
                this.getMenuTree()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
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
