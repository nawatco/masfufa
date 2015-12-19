/**
* @author https://sa.linkedin.com/in/abdennour
*
*/
(function(_w,_d,echo,scalar){

  _w.Masfufa =function(){
    if(arguments.length>1){
      this.data=this.init.apply(this,arguments);
    }else{
      this.data=arguments[0];
      this.format=this.data.length;
      if(this.format ){
        this.dimensions={rows:this.format,cols:this.data[0].length};
        this.format=this.format+'x'+this.data[0].length;

      }
    }

    return this;
  };

  _w.Masfufa.prototype.init=function(data,format){
    this.format=format;
    var [_r,_c]=format.split('x').map((e)=>{return parseInt(e)});
    var arr=[];
    this.dimensions={rows:_r,cols:_c};
    arr=echo.skeleton(format);
    data.forEach(function(e,i){
      arr[parseInt(i/_c)][i%_c]=e;
    });
    return arr;
  };
  _w.Masfufa.prototype.disp=function(){
    return this.data;
  };

  _w.Masfufa.prototype.T=function(){
    tarr =_w.Masfufa.zeros(echo.formatInv(this.format));
    this.data.forEach(function(e,i){
      e.forEach(function(f,j){
        tarr.data[j][i]=this.data[i][j];
      },this);
    },this)
    return tarr;
  };


  _w.Masfufa.prototype.rows=function(){
    var rws=[];
    var that=this;
    [].slice.call(arguments).forEach(function(rIndex,i){
         rws.push(that.data[rIndex]);
    });
    return new _w.Masfufa(rws);
  };

  _w.Masfufa.prototype.cols=function(){
    var colIndexs=[].slice.call(arguments),_cols=_w.Masfufa.zeros(this.dimensions.rows+'x'+arguments.length);
    this.forEach(function(e,i,j){

       if(colIndexs.indexOf(j)>=0){
          _cols.data[i][colIndexs.indexOf(j)]=e;
       }
    });
    return _cols;

  };
  _w.Masfufa.prototype.get=function(rows,cols){
     (rows instanceof Array)?rows=rows:rows=[rows];
     (cols instanceof Array)?cols=cols:cols=[cols];

     return this.rows(...rows).cols(...cols);

  };
  _w.Masfufa.prototype.diag=function(){
   //TODO
  };
  _w.Masfufa.prototype.antidiag=function(){
   //TODO
  };
  _w.Masfufa.prototype.det=function(){
   //TODO
  };
 /**
 * Arithmetics
 */
  _w.Masfufa.prototype['+']=function(m2){
   var arr=_w.Masfufa.zeros(this.dimensions.rows,this.dimensions.cols);
   if(typeof m2 ==='number'){
      this.forEach(function(e,i,j){arr.data[i][j]=e+ m2});
   }
   if(this.format === m2.format){
     var that=this;
     arr.forEach(function(e,i,j){
        arr.data[i][j]=that.data[i][j]+m2.data[i][j];
     },this);

   }
      return arr;
 };
   _w.Masfufa.prototype['-']=function(m2){
    return this['+']((-1)['*'](m2));
  };

  _w.Masfufa.prototype['*']=function(m2){
    if(typeof m2 ==='number'){
      return this.map(function(e){return e* m2});
    }
    if(this.dimensions.cols=== m2.dimensions.rows){
      arr=_w.Masfufa.zeros(this.dimensions.rows,m2.dimensions.cols);
      arr.data.forEach(function(e,i){
        e.forEach(function(f,j){
          arr.data[i][j]=this.data[i].map(function(g,k){return g*m2.data[k][j] }).reduce(function(a,b){return a+b},0);
        },this);
      },this);
      return  arr;
    }else{
      return new Error('Inner matrix dimensions must agree.','x');

    }
  };
    _w.Masfufa.prototype['/']=function(m2){
           if(typeof m2 ==='number'){
                     return this.map(function(e){return e/ m2});
           }
           var that=this;
           if(this.dimensions.cols=== m2.dimensions.rows){
             arr=_w.Masfufa.zeros(this.dimensions.rows,m2.dimensions.cols);
             arr.data.forEach(function(e,i){
               e.forEach(function(f,j){
                 arr.data[i][j]=that.data[i].map(function(g,k){return g/m2.data[k][j] }).reduce(function(a,b){return a+b},0);
               });
             });
             return  arr;
           }else{
             return new Error('Inner matrix dimensions must agree.','/');

           }

    }
  _w.Masfufa.prototype['.^']=function(m2){
    if(typeof m2 ==='number'){
      return this.map(function(e){return Math.pow(e,m2)});
    }
  }
  _w.Masfufa.prototype.isSquare=function(){
    return this.dimensions.rows === this.dimensions.cols;
  }

  _w.Masfufa.prototype['^']=function(m2){

    if(this.isSquare()){
      var that=this;
      var res=this;
      for(var i=1;i<m2;i++){
        res=res['*'](that);
      }
      return res;
    }
  };

  /**
  **
  * Logic Operations
  */
  _w.Masfufa.prototype['==']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e ===m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e ===m2.data[i][j])?1:0});
     }
  };
  _w.Masfufa.prototype['>']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e > m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e >m2.data[i][j])?1:0});
     }
  };
  _w.Masfufa.prototype['<']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e <m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e <m2.data[i][j])?1:0});
     }
  };

  _w.Masfufa.prototype['>=']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e >=m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e >=m2.data[i][j])?1:0});
     }
  };
  _w.Masfufa.prototype['<=']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e <=m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e <=m2.data[i][j])?1:0});
     }
  };

  _w.Masfufa.prototype['~=']=function(m2){
     if(typeof m2 ==='number'){
        return this.map(function(e){return  (e !=m2)?1:0 });
     }
     if(this.format === m2.format){
           return this.map(function(e,i,j){return (e !=m2.data[i][j])?1:0});
     }
  };

  //--------------END Logic Operations --------------------------\\
  _w.Masfufa.prototype.map=function(fn){
    var that=this;
   var arr=_w.Masfufa.zeros(that.dimensions.rows,this.dimensions.cols);
    that.data.forEach(function(e,i){
      e.forEach(function(f,j){
        arr.data[i][j]=fn.call(that,f,i,j);
      });
    });
    return arr;
  };
  _w.Masfufa.prototype.filter=function(fn){

  };
  _w.Masfufa.prototype.forEach=function(fn){
    var that=this;
    this.data.forEach(function(e,i){
      e.forEach(function(f,j){
        fn.call(that,f,i,j);
      });
    });

  };
  _w.Masfufa.prototype.sum=function(){
    return new _w.Masfufa(this.data.map(function(rw){ return rw.reduce(function(a,b){return a+b}) }),'1x'+echo.dim(this.format)[0]);
  }
  _w.Masfufa.prototype.inv=function(){}

  _w.Masfufa.prototype.valueOf=function(){
    return this.data;
  };
  _w.Masfufa.prototype.toString=function(){
    if(this.dimensions.rows ===1 && this.dimensions.cols ===1){return  '\n\t'+this.data[0][0]+'\n\r'}
    var max=this.data.map(function(rw){return rw.join(',')}).join(',').split(',').reduce(function (a, b) { return a.length > b.length ? a : b; });
    var spaceNode=max.length+4;
    var spaces=function(n){
      str='';
      for(var i=1;i<=n;i++){
           str=str+' ';
      }
      return str;
    }
    var format=function(e){
          var toAdd=parseInt((spaceNode -(e+'').length )/2 );
          return spaces(toAdd)+e+spaces(toAdd)+spaces((spaceNode -(e+'').length )%2)
    };
    return '\n\r\n'+this.data.map(function(rw){return '|'+rw.map(function(e){return format(e)}).join('')+' |'}).join('\n\r')+'\n\r';
  }
  /**static
  * */
  _w.Masfufa.zeros=function(f){
    f=echo.dim.apply(null,arguments);
      return new _w.Masfufa([for (i of Array(f[0])) [for (j of Array(f[1])) 0]]);

  };
  _w.Masfufa.empty=function(f){
    f=echo.dim.apply(null,arguments);
    return new _w.Masfufa([for (j of Array(f[0])) Array(f[1])]);

  };
  _w.Masfufa.ones=function(f){
    f= echo.dim.apply(this,arguments);
    return new _w.Masfufa([for (i of Array(f[0])) [for (j of Array(f[1])) 1]]);
  };

  _w.Masfufa.eye=function(f){
    f= echo.dim.apply(null,arguments);
    return  new _w.Masfufa([for (i of Array(f[0]).keys()) [for (j of Array(f[1]).keys()) (i===j)?1:0]]);
  };

  /**
  * SCALAR
  */
  /**
  *
  *   Arithmetics Operations
  ********/

  scalar['+']=function(a){
     if(typeof a ==='number'){return this.valueOf()+a}
     if(a instanceof _w.Masfufa){
       return a['+'](this.valueOf());
     }
  };
  scalar['-']=function(a){
     if(typeof a ==='number'){return this.valueOf()-a}
     if(a instanceof _w.Masfufa){
       return a['-'](this.valueOf());
     }
  };

  scalar['*']=function(a){
     if(typeof a ==='number'){return this.valueOf()*a}
     if(a instanceof _w.Masfufa){
       return a['*'](this.valueOf());
     }
  };
  scalar['/']=function(a){
     if(typeof a ==='number'){return this.valueOf()/a}
     if(a instanceof _w.Masfufa){
       return a['/'](this.valueOf());
     }
  };
/***
*
*   Logic Operations
*
****************/
scalar['==']=function(a){
   if(typeof a ==='number'){return this.valueOf()===a}
   if(a instanceof _w.Masfufa){
     return a['=='](this.valueOf());
   }
};
scalar['~=']=function(a){
   if(typeof a ==='number'){return this.valueOf()!=a}
   if(a instanceof _w.Masfufa){
     return a['~='](this.valueOf());
   }
};
scalar['>=']=function(a){
   if(typeof a ==='number'){return this.valueOf()>=a}
   if(a instanceof _w.Masfufa){
     return a['<'](this.valueOf());
   }
};
scalar['>']=function(a){
   if(typeof a ==='number'){return this.valueOf()>a}
   if(a instanceof _w.Masfufa){
     return a['<='](this.valueOf());
   }
};
scalar['<']=function(a){
   if(typeof a ==='number'){return this.valueOf()<a}
   if(a instanceof _w.Masfufa){
     return a['>='](this.valueOf());
   }
};
scalar['<=']=function(a){
   if(typeof a ==='number'){return this.valueOf()<=a}
   if(a instanceof _w.Masfufa){
     return a['>'](this.valueOf());
   }
};



  /**
  * PRIVATE
  */
  echo.formatInv=function(format){

    return format.split('x').reverse().join('x');
  };
  echo.dim=function(format){
     if(arguments.length===2){
       return [].slice.call(arguments);
     }
     if(arguments.length===1 && (arguments[0]+'').indexOf('x')===-1){
       return [parseInt(format),parseInt(format)];
     }
    return format.split('x').map(function(e){return parseInt(e)})
  }
  echo.skeleton=function(format){
    return [for (j of Array(echo.dim.apply(null,arguments)[0])) []];
  }

  _w.M=_w.Masfufa;
  _w.pv=echo;
})(window,document,function(a){console.log(a)},Number.prototype)
