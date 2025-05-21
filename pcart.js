/*
  pomeloCart
  Author : pomeloJ
  description : just easy to use
*/
class pomeloCart{
  //init
  constructor(importData,setting){
    this.autosave = true;
    

    setting = setting || false;//if input setting

    if(setting['autosave']!=null)this.autosave=setting['autosave'];//if set autosave setting

    let importString = importData || localStorage.getItem('pomeloCartData') || false;

    if(importString!==false){
      this.import(importString);
      return true;
    }
    
    this.empty();

    return true;
  }
  //Add Item
  addItem = function(data,callback){
    /*
      id:(Required)
      price:(Required)
      quantity:(Required)
      data:(free)
    */
    let pd = this.parseInput(data);

    // default quantity when not provided
    if(pd['quantity'] === false) pd['quantity'] = 1;

    let uid = this.makeUid();//for now no use

    //check if data is exist with ID
    let chkResult = this.chkItem({'id':pd['id']});

    //if no then create new first
    if(chkResult==false){
      this.idArr.push({
        'id':pd['id'],
        'price':pd['price'],
        'quantity':pd['quantity'],
        'data':pd['data']
      });

      this.calData();
      this.saveData();

      return this;
    }

    //if exist data with ID , Calculation quantity for exist data
      //get data quantity for now
      let gData=this.getItem({'id':pd['id']});
      let resultQuantity = pd['quantity'] + gData['quantity'];

      //edit final data
      this.editItem({
        'id':pd['id'],
        'price':pd['price'],
        'quantity':resultQuantity,
        'data':pd['data']
      });

     if(typeof (callback) == 'function') callback();

      return this;
  }
  //Edit Item
  editItem = function(data,callback){
    /*
      id:(Required)
      price:(Required)
      quantity:(Required)
      data:(free)
    */
    let pd = this.parseInput(data);

    //check if data is exist with ID
    let chkResult = this.chkItem({'id':pd['id']});
    if(chkResult===false)return false;

    //if quantity is provided and less than 0 , make it to 0
    if(pd['quantity'] !== false && pd['quantity'] < 0) pd['quantity'] = 0;

    //get data quantity for now
    let gData=this.getItem({'id':pd['id']});

    //find index in array where
    let inx = this.findIdIndex({'id':pd['id']});

    //save data
    if(pd['price']!==false)gData['price']=pd['price'];
    if(pd['quantity']!==false)gData['quantity']=pd['quantity'];
    if(pd['data']!==false)gData['data']=pd['data'];

    this.idArr[inx]=gData;

    this.calData();
    this.saveData();

    if (typeof (callback) == 'function') callback();

    return this;
  }
  //Delete Item
  delItem = function(data,callback){
    let pd = this.parseInput(data);

    //check if data is exist with ID
    let chkResult = this.chkItem({'id':pd['id']});
    if(chkResult===false)return false;

    this.idArr = this.idArr.filter(item => item.id !== pd['id']);

    this.saveData();

    if (typeof (callback) == 'function') callback();

    return this;
  }
  //List items with array
  list = function(){

    return this.idArr;
  }
  //List items detail with array
  listDetail = function(){
    return this.idArr;
  }
  //empty Cart
  empty = function(callback){
    this.idArr=[];//Master ID array
    this.uidArr=[];//unit ID array
    this.noteData = {};//note
    this.shippingData = {}//shipping data
    this.couponArr = [];//coupon data

    this.saveData();

    if (typeof (callback) == 'function') callback();

    return this;
  }
  //get total summary
  total = function(){
    //Calculation price for items
    let itemPrice=0;
    let itemQuantity=0;
    this.idArr.forEach(function(element){
      let tmpTotal = element.quantity * element.price;
      itemPrice += tmpTotal;
      itemQuantity += element.quantity;
    });

    let shippingPrice=(typeof(this.shippingData['price'])!='number'?0:this.shippingData['price']);//shipping
    let noteData=this.noteData;//note data
    let discountPrice = this.couponDiscount();
    let allPrice = parseInt(shippingPrice) + parseInt(itemPrice) - discountPrice;//all price

    let pd={
      'allPrice':allPrice,//all price
      'itemPrice':itemPrice,//items all price
      'itemQuantity':itemQuantity,//items quantity
      'shippingPrice':shippingPrice,//shipping fee
      'shippingData':this.shippingData,//all shipping data
      'note':noteData,//note data
      'couponDiscount':discountPrice
    }

    return pd;
  }
  //note
  setNote = function (data, callback){
    /*
      no limit, just fill it
    */
    this.noteData = data;

    this.saveData();

    if (typeof (callback) == 'function') callback();

    return this;
  }
  //shipping data
  setShipping = function(input,data,callback){
    /*
      type:(Required)
      name:(Required)
      price:(Required)
      --
      data : no limit, just fill it
    */
    let price = (typeof(input['price'])=='number'?input['price']:0);
    let type = input['type'] || false;
    let name = input['name'] || false;
    let inputData = data || false;

    this.shippingData = {
      'type':type,
      'name':name,
      'price':price,
      'data':inputData
    }

    this.saveData();

    if (typeof (callback) == 'function') callback();

    return this;
  }

  //coupon functions
  addCoupon = function(data, callback){
    let coupon = {
      'id': this.makeUid(),
      'tag': data['tag'] || false,
      'itemTag': data['itemTag'] || false,
      'minPrice': typeof(data['minPrice']) === 'number' ? data['minPrice'] : 0,
      'discountType': data['discountType'] || 'amount',
      'discountValue': typeof(data['discountValue']) === 'number' ? data['discountValue'] : 0
    };

    if(coupon.tag !== false){
      this.couponArr = this.couponArr.filter(c => c.tag !== coupon.tag);
    }

    this.couponArr.push(coupon);

    this.saveData();

    if(typeof(callback) == 'function') callback();

    return this;
  }

  couponList = function(){
    return this.couponArr;
  }

  delCoupon = function(data, callback){
    let id = data['id'] || false;
    if(id === false) return false;

    this.couponArr = this.couponArr.filter(c => c.id !== id);

    this.saveData();

    if(typeof(callback) == 'function') callback();

    return this;
  }

  clearCoupons = function(callback){
    this.couponArr = [];

    this.saveData();

    if(typeof(callback) == 'function') callback();

    return this;
  }

  couponDiscount = function(){
    let discount = 0;
    this.couponArr.forEach(coupon => {
      let tagTotal = 0;
      this.idArr.forEach(item => {
        let t = item.data && item.data.tag ? item.data.tag : false;
        if(coupon.itemTag === false || t === coupon.itemTag){
          tagTotal += item.price * item.quantity;
        }
      });

      if(tagTotal >= coupon.minPrice){
        if(coupon.discountType === 'percent'){
          discount += tagTotal * coupon.discountValue;
        }else{
          discount += coupon.discountValue;
        }
      }
    });

    return discount;
  }
  //export data
  export = function(){
    let preString={
      'idArr':this.idArr,
      'shippingData':this.shippingData,
      'noteData':this.noteData,
      'couponArr':this.couponArr
    }

    let exportString = JSON.stringify(preString);

    return exportString;
  }
  //import data
  import = function(importData){
     let result;
     try{
       result = JSON.parse(importData);
     }catch(err){
       return false;
     }

    this.idArr = result['idArr'] || [];
    this.shippingData = result['shippingData'] || {};
    this.noteData = result['noteData'] || {};
    this.couponArr = result['couponArr'] || [];

     this.calData();
     this.saveData();

    return this;
  }

/*
  internal
*/
  //make uid
  makeUid = function(){
     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  //check data and processing
  parseInput = function(data){
    // handle cases where argument is missing or not an object
    data = (typeof data === 'object' && data !== null) ? data : {};

    let id = (data.hasOwnProperty('id') ? data['id'] : false);
    let price = (data.hasOwnProperty('price') ? data['price'] : false);
    let quantity = (data.hasOwnProperty('quantity') ? data['quantity'] : false);
    let d = (data.hasOwnProperty('data') ? data['data'] : false);

    let finalData={
      'id':id,
      'price':price,
      'quantity':quantity,
      'data':d
    }

    this.inputData = finalData;

    return finalData;
  }
  //check if data exist with ID
  chkItem = function(data){
    let id = data['id'] || false;
    let result = this.idArr.find((d)=>{ return d['id'] == id});

    if(typeof(result) === 'undefined')return false;
    return true;
  }
  //find index where in array
  findIdIndex = function(data){
    /*
      id:
    */
    let id = data['id'] || false;

    let arrInx = this.idArr.findIndex(function(element){
      if(element['id']==id)return true;
    });

    return arrInx;
  }
  //get item data with ID
  getItem = function(data){
    /*
      id
    */
    let id = data['id'] || false;

    let gd={}

    //if set id then get from ID
    if(id!==false){
      gd = this.idArr.find((d)=>{ return d.id == id});
    }

    return gd;
  }
  //autosave
  saveData = function(){
    let exportingString = this.export();

    localStorage.setItem('pomeloCartData',exportingString);

    return true;
  }
  //calData
  calData=function(){
     this.idArr.forEach((element, i, ori) => {
       //cal subtotal
      element.subtotal = (element.quantity * element.price);
    });
  }
}

module.exports = pomeloCart;
