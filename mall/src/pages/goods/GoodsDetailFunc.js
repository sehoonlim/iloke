$(function(){
    price_tot();
    // 옵션1 드롭박스 선택시
    $(".color-option").change(function(){
        if($(this).val() == "none"){
            $(".leather-option").attr("disabled","disabled");
            $(".stool-option").attr("disabled","disabled");
        }else{
            $(".leather-option").removeAttr("disabled");
        }
    });

    // 옵션2 드롭박스 선택시
    $(".leather-option").change(function(){
        if($(this).val() == "none"){
            $(".stool-option").attr("disabled","disabled");
        }else{
            $(".stool-option").removeAttr("disabled");
        }
    });

    // 옵션3 드롭박스 선택시
    $(".stool-option").change(function() {
        //$("#additional-items").empty(); // 기존 항목 제거
        if ($(this).val() != "none") {
            // 선택된 값에 따라 추가 항목 생성
            var option = $(".color-option").val() + "_" + $(".leather-option").val() + "_" + $(".stool-option").val(); // 현재 옵션값
            var option_price = parseInt($(".color-option option:selected").attr("data-chrg")) + 
                               parseInt($(".leather-option option:selected").attr("data-chrg")) + 
                               parseInt($(".stool-option option:selected").attr("data-chrg"));
            var final_price = parseInt($(".final-price").attr("data-chrg")) + option_price

            // 기존 항목 확인
            if ($("#prod_" + option).length <= 0) {
                // 새로운 아이템 생성
                const newItem = `<div class="option-bg" id="prod_` + option + `">`
                              + `<span class="option-select">` + $(".color-option option:selected").text() 
                              + ` / ` + $(".leather-option option:selected").text() + ` / ` + $(".stool-option option:selected").text() 
                              + ` <br/>=> 최종옵션가 (` + formatNumber(option_price) + `원)</span>`
                              + `<div class="option-display">`
                              + `<div class="option-quantity">`
                              + `<button class="option-minus" onClick="clac('`+ option +`','-')">🗑️</button>`
                              + `<input type="text" class="option-count" value="1" data-value="` + final_price + `" readonly />`
                              + `<button class="option-plus" onClick="clac('`+ option +`','+')">+</button>`
                              + `</div>`
                              + `<div class="option-amount">`
                              + `<strong>` + formatNumber(final_price) + `</strong>원`
                              + `</div>`
                              + `</div>`
                              + `</div>`;
    
                $(".option-calc").before(newItem);
    
                // 스타일 재적용 (필요할 경우)
                prodCssReload();
                price_tot();
            }else{
                alert("이미 선택된 옵션입니다.");
            }
        }
    });
});

function prodCssReload(){

    $(".option-bg").css({"border-top": "1px solid #ccc",
                        "border-bottom": "1px solid #ccc",
                        "padding": "30px 20px"});

     $(".option-select").css({"display": "block",
                            "font-size": "1rem",
                            "font-weight": "400",
                            "letter-spacing": "-0.5px",
                            "font-style": "normal",
                            "padding": "15px 0"})
      $(".option-display").css({    display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "padding": "5px 0"})

    $(".option-quantity").css({
        "display": "flex",
        "justify-content": "space-between"
    })

    $(".option-plus").css({ "width": "35px",
                            "height": "35px",
                            "cursor": "pointer",
                            "border": "1px solid #ccc"
                        })

    $(".option-minus").css({ "width": "35px",
                            "height": "35px",
                            "cursor": "pointer",
                            "border": "1px solid #ccc"
                        })

    $(".option-count").css({"width": "35px",
                            "height": "35px",
                            "padding": "0",
                            "color": "#111",
                            "font-size": "16px",
                            "font-weight": "400",
                            "line-height": "1",
                            "border": "none",
                            "border-top": "1px solid #ccc",
                            "border-bottom": "1px solid #ccc",
                            "box-sizing": "border-box",
                            "text-align": "center",
                            "appearance": "none"
                        })
}

function clac(element, op){
    let prod_val = $("#prod_"+element).find(".option-count");
    if(op == "+"){
        $("#prod_"+element).find(".option-minus").text("-");
        prod_val.val(parseInt(prod_val.val())+1);
    }else if(op == "-"){
        prod_val.val(parseInt(prod_val.val())-1);
        if(parseInt(prod_val.val()) <= 0){
            close(element);  
        }else if(parseInt(prod_val.val()) <= 1){
            $("#prod_"+element).find(".option-minus").text("🗑️");
        } 
    }

    price_tot();
}

function price_tot(){
    $(".option-count").each(function() {
        var count = $(this).val(); // 현재 .option-count의 값
        var dataValue = $(this).attr("data-value"); // 현재 .option-count의 data-value 속성
        var price = count * dataValue; // 가격 계산
        // 각 항목에 대해 .option-amount > strong 업데이트
        $(this).closest('.option-display').find(".option-amount > strong").text(formatNumber(price));
    });

    var tot_price = 0;
    $(".option-amount > strong").each(function() {
        tot_price += parseInt(removeCommas($(this).text()));
    })
    $(".option-total dd").text(formatNumber(tot_price) +"원")
}

// 3자리 숫자마다 , 붙이기(금액)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 쉼표를 제거하고 숫자를 붙이는 함수
function removeCommas(numStr) {
    return numStr.replace(/,/g, "");
}

function close(element){
    $("#prod_" + element).remove();
}

function buy_chk(_connect){
    // console.log($(".option-bg").length);
    if(!$(".option-bg").length){
        alert("옵션이 선택되지 않았습니다!");
        return false;
    }

    loadContent('./sub/order/' + _connect + '.html')
}

// 클립보드 복사
function clipBoard() {
    let clipboardBtn = document.querySelector(".clipboard-btn");
    let copyLink = clipboardBtn.getAttribute("data-clipboard-text");

    navigator.clipboard.writeText(copyLink);
    alert("URL 주소를 복사했습니다.");
}

// 섹션 이동
function targetScroll(sectionId) {
    const moveScroll = document.getElementById(sectionId);

    if (moveScroll) {
        moveScroll.scrollIntoView({
            behavior: 'smooth', block: 'start'
        })
    }
}

// 하트 on/off
$(function () {
    $('.product-actions .heart-btn').on('click', function () {
        let lineBtn = $(".line");
        let fullBtn = $(".full");

        if (fullBtn.css('display') == 'none'){
            fullBtn.css("display", "block");
            lineBtn.css("display", "none");
        } else if (fullBtn.css("display") == "block") {
            lineBtn.css("display", "block");
            fullBtn.css("display", "none");
        }
    });
});


// 포토후기 모아보기 모달

$(function () {
    let modal = document.getElementById("imageModal")
    let btn = document.getElementsByClassName("photo-review-imagebox")
    let close = document.getElementsByClassName("close")[0]
    let modalImg = document.querySelector("#modalImage img")
    
    for (let i = 0; i < btn.length; i++) {
        btn[i].onClick = function () {
            let imgSrc = this.querySelector("img").src
            modalImg.src = imgSrc
            modal.style.display = "block"
        }
    }
    
    close.onClick = function () {
        modal.style.display = "none"
    }
    
    window.onClick = function (event) {
        if(event.target == modal) {
            modal.style.display = "none"
        }
    }
})

// textarea 작동
$(function () {
    let textBtn = document.querySelector(".review-regist-button");

    textBtn.addEventListener('click', function () {
        let textArea = document.querySelector(".textReview");
        if (!textArea) {
            console.error("ID가 'postContent'인 텍스트 영역을 찾을 수 없습니다.");
            return;
        }

        let content = textArea.value.trim();
        if (content == "") {
            alert("내용을 입력해주세요.");
        } else {
            let question = confirm("글을 등록하시겠습니까?");

            if (question) {
                alert("게시물을 등록하였습니다.");
            } else {
                alert("등록이 취소되었습니다.");
            }
        }
    });
});

