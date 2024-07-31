var ChuSoDon = new Array('không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín');

//Hàm đọc số có tối đa 3 số thành chữ
function DocSo3ChuSoNew(baso) {
    var SoHangDonVi = baso % 10;
    //console.log(SoHangDonVi);
    var tmpPhanNguyen = Math.floor(baso / 10);
    var SoHangChuc = tmpPhanNguyen % 10;
    //console.log(SoHangChuc);
    tmpPhanNguyen = Math.floor(tmpPhanNguyen / 10);
    var SoHangTram = tmpPhanNguyen % 10;
    //console.log(SoHangTram);

    var rt = '';
    //Chỉ tồn tại chữ số hàng đơn vị
    if (SoHangDonVi >= 0 && SoHangChuc == 0 && SoHangTram == 0) {
        rt += ChuSoDon[SoHangDonVi] + ' ';
        return rt;
    }

    //Chỉ tồn tại chữ số hàng đơn vị và chữ số hàng chục
    if (SoHangDonVi >= 0 && SoHangChuc > 0 && SoHangTram == 0) {
        switch (SoHangChuc) {
            case 1: {
                rt += 'mười ';
                break;
            }
            default: {
                rt += ChuSoDon[SoHangChuc] + ' mươi ';
                break;
            }
        }

        switch (SoHangDonVi) {
            case 0: {
                //if (SoHangChuc > 1)
                //rt += "mươi ";
                break;
            }
            case 1: {
                if (SoHangChuc > 1)
                    rt += 'mốt ';
                else
                    rt += 'một ';
                break;
            }
            case 4: {
                if (SoHangChuc > 1)
                    rt += 'bốn ';
                else
                    rt += 'bốn ';
                break;
            }
            case 5: {
                if (SoHangChuc > 0)
                    rt += 'lăm ';
                else
                    rt += 'năm ';
                break;
            }
            default: {
                rt += ChuSoDon[SoHangDonVi] + ' ';
                break;
            }
        }

        return rt;
    }

    //Tồn tại cả 3 số

    //Đọc chữ số hàng trăm
    rt = ChuSoDon[SoHangTram] + ' trăm ';

    //Đọc chữ số hàng chục
    switch (SoHangChuc) {
        case 0: {
            if (SoHangDonVi != 0) rt += 'lẻ ';
            break;
        }
        case 1: {
            rt += 'mười ';
            break;
        }
        default: {
            rt += ChuSoDon[SoHangChuc] + ' mươi ';
            break;
        }
    }

    //Đọc chữ số hàng đơn vị
    switch (SoHangDonVi) {
        case 0: {

            break;
        }
        case 1: {
            if (SoHangChuc > 1) rt += 'mốt ';
            else rt += 'một ';
            break
        }
        case 4: {
            if (SoHangChuc > 1) rt += 'bốn ';
            else rt += 'bốn ';
            break;
        }
        case 5: {
            if (SoHangChuc > 0) rt += 'lăm ';
            else rt += 'năm ';
            break;
        }
        default: {
            rt += ChuSoDon[SoHangDonVi] + ' ';
            break;
        }
    }

    return rt;
}

//Hàm đảo ngược chuỗi
function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(''); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(''); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}

//Hàm Remove ký tự trong chuỗi
function Remove(str, startIndex, count) {
    return str.substr(0, startIndex) + str.substr(startIndex + count);
}

//Hàm tách số ban đẩu thành bộ tối đa MaxNum số một từ phải qua trái
function PhanTachThanhSoCoToiDaSo(NumFull, MaxNum) {
    //chuyển số sang chuỗi
    //console.log('NumFull: ' + NumFull);
    var StringNumFullReal = NumFull.toString();

    //Cắt số ký tự đầu tiên bị thừa ra so với 9 chữ số
    var PhanTuThua = '';
    //tính số ký tự thừa
    var SoKyTuThua = StringNumFullReal.length % MaxNum;
    //console.log('SoKyTuThua: '+SoKyTuThua);
    if (SoKyTuThua > 0) {
        for (var i = 0; i < SoKyTuThua; i++) {
            PhanTuThua += StringNumFullReal[i];
        }

        //console.log('PhanTuThua: '+PhanTuThua);
        StringNumFullReal = Remove(StringNumFullReal, 0, SoKyTuThua);
        //console.log(StringNumFullReal);
    }

    //đảo ngược chuỗi
    var StringNumFullReverse = reverseString(StringNumFullReal);
    var ArrayCharReverse = StringNumFullReverse.split('');
    var ArrayRt = [];

    for (var i = 0; i < ArrayCharReverse.length; i = i + MaxNum) {
        var tmpString = '';
        for (var j = i; j < i + MaxNum; j++) {
            tmpString += ArrayCharReverse[j];
        }
        tmpString = reverseString(tmpString);
        ArrayRt.push(tmpString);
    }

    if (PhanTuThua != '') {
        ArrayRt.push(PhanTuThua);
    }

    ArrayRt = ArrayRt.reverse();
    return ArrayRt;
}

//Hàm đọc số thành chữ
function DocSoThanhChu(Number) {
    var rt = '';
    var Array9So = PhanTachThanhSoCoToiDaSo(Number, 9);
    for (var i = 0; i < Array9So.length; i++) {
        //console.log(Array9So[i]);
        var Array3So = PhanTachThanhSoCoToiDaSo(Array9So[i], 3);

        var rt9so = '';
        for (var j = 0; j < Array3So.length; j++) {
            //console.log(Array3So[j]);
            var rt3so = '';
            rt3so += DocSo3ChuSoNew(Array3So[j]);
            switch (Array3So.length) {
                //có 1 bộ 3 số phần đơn vị
                case 1: {
                    break;
                }
                //có 2 bộ 3 số phần nghìn, phần đơn vị
                case 2: {
                    //Bộ 3 số là 000 => không đọc
                    if (Array3So[j][0] == '0' && Array3So[j][1] == '0' && Array3So[j][2] == '0') {
                        rt3so = '';
                    }
                    else {
                        if (Array3So[j][0] == '0' && !rt3so.includes('không trăm') && Array3So[j][1] == '0' && !rt3so.includes('lẻ'))
                            rt3so = 'không trăm lẻ ' + rt3so;
                        else {
                            if (Array3So[j][0] == '0' && !rt3so.includes('không trăm') && Array3So[j].length == 3)
                                rt3so = 'không trăm ' + rt3so;
                            else {
                                if (Array3So[j][1] == '0' && !rt3so.includes('lẻ') && Array3So[j][0] == '0' && Array3So[j].length == 3)
                                    rt3so = 'lẻ ' + rt3so;
                            }
                        }
                        if (j == 0)
                            rt3so += 'nghìn ';
                    }
                    break;
                }
                //có 3 bộ 3 số phần triệu, phần nghìn, phần đơn vị
                case 3: {
                    //Bộ 3 số là 000 => không đọc
                    if (Array3So[j][0] == '0' && Array3So[j][1] == '0' && Array3So[j][2] == '0') {
                        rt3so = '';
                    }
                    else {
                        if (Array3So[j][0] == '0' && !rt3so.includes('không trăm') && Array3So[j][1] == '0' && !rt3so.includes('lẻ'))
                            rt3so = 'không trăm lẻ ' + rt3so;
                        else {
                            if (Array3So[j][0] == '0' && !rt3so.includes('không trăm') && Array3So[j].length == 3)
                                rt3so = 'không trăm ' + rt3so;
                            else {
                                if (Array3So[j][1] == '0' && !rt3so.includes('lẻ') && Array3So[j][0] == '0' && Array3So[j].length == 3)
                                    rt3so = 'lẻ ' + rt3so;
                            }
                        }

                        if (j == 0) rt3so += 'triệu ';
                        if (j == 1) rt3so += 'nghìn ';
                    }
                    break;
                }
            }
            rt9so += rt3so;
        }
        //Hậu tố tỷ
        var HauToTy = '';
        for (var j = 0; j < Array9So.length - i - 1; j++) {
            HauToTy += 'tỷ ';
        }

        rt9so += HauToTy;
        rt += rt9so;
    }
    rt = rt.replace(/\ ,+/gm, ',');

    rt = rt.charAt(0).toUpperCase() + rt.slice(1);
    return rt;
}

/**
 * Hàm đọc tiền thành chữ
 * @param {any} Number số tiền kiểu giá trị string
 * @param {any} IntegerPart tiếng đọc phân nguyên
 * @param {any} DecimalPart tiếng đọc phần thập phân
 * @returns
 */
function DocTienThanhChu(Number, IntegerPart, DecimalPart) {
    var rt = '';
    var isNegative = false;

    if (Number < 0) {
        isNegative = true;
        Number = Math.abs(Number);
    }

    var PhanNguyen = Number.toString().split('.')[0];
    var PhanLe = '00';
    if (Number.toString().split('.').length == 2) {
        PhanLe = Number.toString().split('.')[1];
        if (PhanLe.length == 1) {
            PhanLe += "0";
        }
    }
    PhanLe = parseInt(PhanLe) + '';

    var DocPhanNguyen = DocSoThanhChu(PhanNguyen);
    DocPhanNguyen = DocPhanNguyen.charAt(0).toUpperCase() + DocPhanNguyen.slice(1);
    var DocPhanLe = DocSoThanhChu(PhanLe);
    DocPhanLe = DocPhanLe.toLowerCase();

    rt = DocPhanNguyen + IntegerPart;

    if (DecimalPart != undefined && PhanLe != '0')
        rt = rt + ' và ' + DocPhanLe + DecimalPart;

    if (isNegative) {
        rt = 'Âm ' + rt.toLowerCase();
    }

    return rt;
}
