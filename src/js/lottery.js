App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    //candidatesResults : $("#candidatesResults"),
  
    init: function() {
        return App.initWeb3();
    },
  
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },
  
    initContract: function() {
        $.getJSON("Lottery.json", function(lottery) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.lottery = TruffleContract(lottery);
            // Connect provider to interact with contract
            App.contracts.lottery.setProvider(App.web3Provider);
            
            //App.listenForEvents();
            
            return App.render();
        });
    },
  
    listenForEvents: function() {
        App.contracts.lottery.deployed().then(function(instance) {
            instance.drawedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log("event triggered", event)
                // Reload when a new vote is recorded
                App.render();
                //break;
            });
        });
    },
  
    render: function() {
       
        var transform = App.preTransform();
        var lotteryInstance;
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });
        // Load contract data
        App.contracts.lottery.deployed().then(function(instance) {
            lotteryInstance = instance;
            return lotteryInstance.prizeCount();
        }).then(function(prizeCount) {
            var   lineList = $("#gb-wheel-line");
            var   itemList = $("#gb-wheel-list");
            var turnNum = 1 / prizeCount; 
    
            for (var i = 1; i <= prizeCount; i++) {
                lotteryInstance.prizes(i).then(function(prize) {
                    //alert();
                    var id = prize[0];
                    var name = prize[1];
                    var drawCount = prize[2];
                    if(id==1){
                        lineList.empty();
                        itemList.empty();
                    }
                    // Render candidate Result
                    var itemListHtml='<div class="gb-wheel-item">'+'<div class="gb-wheel-icontent"' + 'style="' + transform 
                    + ': rotate('+ (id * turnNum) +'turn)">' + '<p class="gb-wheel-iicon">'+'<i class="'+id+'"></i>'+'</p>'+'<p class="gb-wheel-itext">'+name+'</p>'+'</div>';//+'</div>';
                    itemList.append(itemListHtml);

                    var lineListHtml='<li class="gb-wheel-litem" style="' + transform 
                    + ': rotate('+ (id * turnNum + turnNum / 2) +'turn)"></li>';
                    lineList.append(lineListHtml);
                    // Render candidate ballot option
                    //var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
                    //candidatesSelect.append(candidateOption);
                });
            }
            return lotteryInstance.drawers(App.account);
        }).then(function(hasdrawed) {
            // Do not allow a user to vote
            if(hasdrawed) {
                //$('form').hide();
            }
        }).catch(function(error) {
            console.warn(error);
        });
    },

    draw: function(){
        var awards = [
            {'index': 0, 'text': '耳机' , 'name': 'icono-headphone'},
            {'index': 1, 'text': 'iPhone' , 'name': 'icono-iphone'},
            {'index': 2, 'text': '相机' , 'name': 'icono-camera'},
            {'index': 3, 'text': '咖啡杯' , 'name': 'icono-cup'},
            {'index': 4, 'text': '日历', 'name': 'icono-calendar'},
            {'index': 5, 'text': '键盘', 'name': 'icono-keyboard'}
        ],
        len = awards.length,
        turnNum = 1 / len;  // 文字旋转 turn 值

        var gbWheel = document.getElementById('gbWheel'),
            lineList = gbWheel.querySelector('ul.gb-wheel-line'),
            itemList = gbWheel.querySelector('.gb-wheel-list'),
            lineListHtml = [],
            itemListHtml = [];

        var transform = preTransform();

        awards.forEach(function(v, i, a) {
            // 分隔线
            lineListHtml.push('<li class="gb-wheel-litem" style="' + transform + ': rotate('+ (i * turnNum + turnNum / 2) +'turn)"></li>');

            // 奖项
            itemListHtml.push('<div class="gb-wheel-item">');
            itemListHtml.push('<div class="gb-wheel-icontent" style="' + transform + ': rotate('+ (i * turnNum) +'turn)">');
            itemListHtml.push('<p class="gb-wheel-iicon">');
            itemListHtml.push('<i class="'+v.name+'"></i>');
            itemListHtml.push('</p>');
            itemListHtml.push('<p class="gb-wheel-itext">');
            itemListHtml.push(v.text);
            itemListHtml.push('</p>');
            itemListHtml.push('</div>');
            itemListHtml.push('</div>');
        });           

        lineList.innerHTML = lineListHtml.join('');
        itemList.innerHTML = itemListHtml.join('');
        //alert(itemListHtml);

        function $(id) {
            return document.getElementById(id);
        };


        // 旋转
        var i = 0;
        $('gbLottery').onclick = function() {
            i++;
            gbWheel.querySelector('.gb-wheel-content').style[transform] =  'rotate('+ i * 3600 * (1+turnNum) +'deg)';  
        }

        // console.log(preTransform());

        // transform兼容
        function preTransform() {
           var cssPrefix,
           vendors = {
             '': '',
             Webkit: 'webkit',
             Moz: '',
             O: 'o',
             ms: 'ms'
           },
           testEle = document.createElement('p'),
           cssSupport = {};

            // 嗅探特性
           Object.keys(vendors).some(function(vendor) {
               if (testEle.style[vendor + (vendor ? 'T' : 't') + 'ransform'] !== undefined) {
                 cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : '';
                 return true;
               }
           });

         /**
          * [兼容CSS前缀]
          * @param  {[type]} name [description]
          * @return {[type]}      [description]
          */
         function normalizeCss(name) {
           name = name.toLowerCase();
           return cssPrefix ? cssPrefix + name : name;
         }

         cssSupport = {
           transform: normalizeCss('Transform'),
         }

         return cssSupport.transform;
        }
    },
  
    preTransform: function() {
        var cssPrefix,
        vendors = {
          '': '',
          Webkit: 'webkit',
          Moz: '',
          O: 'o',
          ms: 'ms'
        },
        testEle = document.createElement('p'),
        cssSupport = {};

         // 嗅探特性
        Object.keys(vendors).some(function(vendor) {
            if (testEle.style[vendor + (vendor ? 'T' : 't') + 'ransform'] !== undefined) {
              cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : '';
              return true;
            }
        });

        /**
         * [兼容CSS前缀]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        function normalizeCss(name) {
          name = name.toLowerCase();
          return cssPrefix ? cssPrefix + name : name;
        }
      
        cssSupport = {
          transform: normalizeCss('Transform'),
        }
      
        return cssSupport.transform;
    },

    castVote: function() {
        var gbWheel = document.getElementById('gbWheel');
        var drawamount = document.getElementById('drawamount');
        //this i is a random number should be returned by contract
        var i = Math.random()*10;
        var transform=App.preTransform();
        var turnNum;
        var drawValue = drawamount.value||1;
        
        //var candidateId = $('#candidatesSelect').val();
        App.contracts.lottery.deployed().then(function(instance) {
            lotteryInstance = instance;
            return lotteryInstance.prizeCount();
        }).then(function(prizeCount) {
            turnNum = 1 / prizeCount; 
            return lotteryInstance.draw(drawValue,{ from: App.account , value: 5000000000000000000 * drawValue }); 
        }).then(function(result) {
            lotteryInstance.randomval(0).then(function(randomval){
                //console.log(randomval);
                //console.log(randomval*turnNum);
                //console.log((360) * (1+randomval*turnNum));
                var rot=(360) * (2+randomval+randomval*turnNum);
                //gbWheel.querySelector('.gb-wheel-content').style[transform] =  'rotate('+ 420 +'deg)';  
                gbWheel.querySelector('.gb-wheel-content').style[transform] =  'rotate('+ rot +'deg)';  
            }).then(function(){
                lotteryInstance.finalresult(0).then(function(result){
                    //alert("You get "+result+" ether");
                    console.log("You get "+result+" ether");
                });
            });
            
        }).catch(function(err) {
            console.error(err);
        });


        
    }
  
};


$(function() {
    $(window).load(function() {
      App.init();
    });
  });