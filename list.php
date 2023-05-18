<?php
require __DIR__.'/src/config.php';
$sheetName = $_GET['title'];
$sheetId = $_GET['sheetId'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <? include './header.php' ?>
</head>
<body data-site="<?= $urlsite ?>">
<div class="container">
   <div class="mt-3"><a class="text-decoration-none" href="<?= $urlsite ?>"><i class="bi bi-arrow-90deg-left"></i><span>Quay lại</span></a></div>
   <div class="row mt-3">
      <div class="col-md-6">
         <div class="action-box1">
            <form class="form-new" action="#" method="post">
               <input class="form-control" type="hidden" name="id" value="0">
               <input class="form-control" type="hidden" name="sheetname" value="<?= $sheetName ?>">
               <div class="mb-1">
                  <label class="form-label" for="exampleFormControlTextarea1">Nhập tên:</label>
                  <div class="d-flex">
                     <span class="txt t-count">0</span>
                     <select class="form-control mb-2 w-auto" name="prefixname">
                        <?php
                           foreach($prfixnames as $item) {
                              ?>
                               <option value="<?= $item ?>"><?= $item ?></option>
                              <?
                           }
                        ?>
                     </select>
                     <input class="form-control ml-1" type="text" required="" name="name" placeholder="tên khách mời">
                  </div>
               </div>
               <div class="text-right">
                  <button class="btn btn-primary" type="submit">
                     <span class="spinner-border spinner-border-sm hide" role="status" aria-hidden="true"></span>
                     Lưu
                  </button>
               </div>
            </form>
         </div>
         <div class="mt-3 mb-3 action-box1">
            <label class="form-label" for="exampleFormControlTextarea1">Cập nhật số tiền:</label>
            <form class="form-update" action="#" method="post">
               <input class="form-control" type="hidden" name="sheetname" value="<?= $sheetName ?>">
               <table style="width: 100%;">
                  <tbody>
                     <tr>
                        <td style="width: 60px;">STT</td>
                        <td> 
                           <input class="mb-2 form-control stt" style="width: 70px; display: inline-block;" type="number" onkeypress="if(this.value.length==4) return false;" required="" name="stt">
                           <input type="hidden" name="indexRow" value="">
                           <span class="ml-2 name-search" style="display: inline-block;font-weight: bold;"> </span>
                        </td>
                        <td style="width: 10px;"></td>
                     </tr>
                     <tr>
                        <td>Số tiền</td>
                        <td><input placeholder="số tiền" class="form-control" type="text" onkeypress="if(this.value.length==20) return false;" required="" name="amount"></td>
                        <td><button class="ml-2 btn btn-primary btn-update-row" type="submit" style="white-space: nowrap;">
                        <span class="spinner-border spinner-border-sm hide" role="status" aria-hidden="true"></span>
                        Cập nhật
                     </button></td>
                     </tr>
                     <tr>
                        <td colspan="3">
                           <div class="mt-1 amoutbox">
                              <?php
                                 foreach($amount as $item) {
                                    ?>
                                    <span class="p5" data-amount="<?= $item ?>"><?= number_format($item , 0, ',', '.') ?>đ </span>
                                    <?
                                 }
                              ?>
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </form>
         </div>
         <div class="mb-2">
            <div class="accordion" id="accordionExample">
               <div class="card">
                  <div class="card-header" id="headingOne">
                     <h5>
                     <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Nhập tên khách không có thiệp mời
                     </button>
                     </h5>
                  </div>
                  <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                     <div class="card-body pad5">
                        <form class="form-new1" action="#" method="post">
                           <input class="form-control" type="hidden" name="id" value="0">
                           <input class="form-control" type="hidden" name="sheetname" value="<?= $sheetName ?>">
                           <div class="mb-1">
                              <div class="d-flex">
                                 <span class="txt t-count">0</span>
                                 <select class="form-control mb-2 w-auto" name="prefixname">
                                    <?php
                                       foreach($prfixnames as $item) {
                                          ?>
                                          <option value="<?= $item ?>"><?= $item ?></option>
                                          <?
                                       }
                                    ?>
                                 </select>
                                 <input class="form-control ml-1" type="text" required name="name" placeholder="tên khách mời">
                                 <input placeholder="số tiền" class="form-control ml-1" type="text" onkeypress="if(this.value.length==15) return false;" required name="amount1">
                              </div>
                           </div>
                           <div class="mt-1 amoutbox1">
                              <?php
                                 foreach($amount as $item) {
                                    ?>
                                    <span class="p5" data-amount="<?= $item ?>"><?= number_format($item , 0, ',', '.') ?>đ </span>
                                    <?
                                 }
                              ?>
                           </div>
                           <div class="text-right">
                              <button class="btn btn-primary" type="submit">
                                 <span class="spinner-border spinner-border-sm hide" role="status" aria-hidden="true"></span>
                                 Lưu
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="chart">
            <canvas id="myChart"></canvas>
         </div>
      </div>
      <div class="col-md-6">
         <div class="d-flex justify-content-between mb-1 action-top">
            <div class="text-success">Tổng khách: <span class="ctotal"></span> <br> 
            <span class="cso">(tham gia: <span class="in">0</span>, vắng: <span class="out">0</span>)</span> </div>
            <button class="btnDelSheet ml-auto btn btn-danger btn-sm" type="button" data-sheetid="<?= $sheetId ?>">
               <span class="spinner-border spinner-border-sm hide" role="status" aria-hidden="true"></span> 
               Xoá tất cả
            </button>
         <button class="btn-print btn btn-info btn-sm ml-2">In</button>
         <button class="btn-save-image btn btn-info btn-sm ml-2">Lưu hình</button>
         </div>
         <div class="tb-scroll">
            <div id="list-detail"></div>
            <script>
                var sheetname = 'Đám cưới Dũng Tú';
               $('.btn-print').click(function() {
                   PrintElem('list-detail', sheetname);
               });
            </script>
         </div>
      </div>
   </div>
   <script src="./html2canvas.min.js"></script>
   <script>
        var sheetname = "<?= $sheetName ?>";
        var sheetId = "<?= $sheetId ?>";
        var sheetData = [];
        var prfixnames = <?= json_encode($prfixnames) ?>;
   </script>
   <script src="./common.min.js"></script>
   <script src="./list.min.js"></script>
</div>
</body>
</html>