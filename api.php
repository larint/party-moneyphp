<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/src/helper/index.php';
require __DIR__.'/ggapi.php';
require __DIR__.'/src/config.php';

$ggapi = new GGAPI;
$client = $ggapi->getGooogleClient();
// configure the Sheets Service
$service = new \Google_Service_Sheets($client);

if($_POST['r'] == 'getSheets') {
    $spreadsheet = $service->spreadsheets->get($spreadsheetId);
    $sheets = $spreadsheet->getSheets();
    $row = '';
    for($i = 0; $i < count($sheets); $i++) {
        $title = $sheets[$i]->getProperties()->getTitle();
        $sheetId = $sheets[$i]->getProperties()->getSheetId();
        $row .= '<tr>
                    <td>'.($i+1).'</td>
                    <td><a href="./list.php?sheetId='.$sheetId.'&title='.$title.'">'.$title.'</a></td>
                    <td class="w0">
                        <span class="btnDelSheet" data-sheetid="'.$sheetId.'" data-sheetName="'.$title.'">
                        <span class="spinner-border spinner-border-sm hide loading-del" role="status" aria-hidden="true"></span>
                        <i class="bi bi-x-circle c1"></i>
                        </span>
                    </td>
                </tr>';
    }
    $row = '<table class="table table-success table-bordered">
                <thead>
                <tr>
                    <th>STT</th>
                    <th class="center" colspan="2">Tên </th>
                </tr>
                </thead>
                <tbody>'.$row.'</tbody>
            </table>';
    echo $row;
} else if($_POST['r'] == 'delSheet') {
    if(isset($_POST['sheetId'])) {
        try {
            $requestBody = new \Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
                "requests" => [
                    "deleteSheet" => [
                        "sheetId" => $_POST['sheetId']
                    ]
                ]
            ]);
      
            $service->spreadsheets->batchUpdate($spreadsheetId, $requestBody);
            return true;
        } catch (Exception $e) {}
    }
    return false;
} else if($_POST['r'] == 'newSheet') {
    if(isset($_POST['name'])) {
        try {
            $requestBody = new \Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
                "requests" => [
                    "addSheet" => [
                        'properties'=> [
                            "title" => $_POST['name']
                        ]
                    ]
                ]
            ]);
      
            $service->spreadsheets->batchUpdate($spreadsheetId, $requestBody);
            return true;
        } catch (Exception $e) {}
        return false;
    }
} else if($_POST['r'] == 'getSheetDetail') {
    $sheetName = $_POST['sheetname'];
    $sheetId = $_POST['sheetId'];
    $response = $service->spreadsheets_values->get($spreadsheetId, $sheetName);
    $sheetDatas = $response->getValues();

    if ($sheetDatas) {
        $max = count($sheetDatas);
        $datas = array();
        foreach ($sheetDatas as $key => $row) {
            $datas[$key] = (int)$row[0];
        }
        array_multisort($datas, SORT_DESC, $sheetDatas);
        $row = '';
        $maxIndex = 0;
        $total = 0;
        for ($i = 0; $i < $max; $i++) {
            $name = '';
            $rowData = $sheetDatas[$i];
            if($maxIndex < $rowData[0]) {
                $maxIndex = (int)$rowData[0];
            }
            $row .= "<tr>";
            for ($j = 0; $j < 4; $j++) {
                if($j == 3) {
                    if(isset($rowData[$j])) {
                        $amount = is_numeric($rowData[$j]) ? number_format((int)$rowData[$j] , 0, ',', '.') : $rowData[$j];
                        $total += is_numeric($rowData[$j]) ? (int)$rowData[$j] : 0;
                        $row .= "<td class=\"text-right\">".$amount."</td>";
                    } else {
                        $row .= "<td></td>";
                    }
                } else if($j == 0) {
                    $idx = $max-$i;
                    $row .= "<td id=\"$rowData[$j]\" data-indexr=\"$idx\">".$rowData[$j]."</td>";
                } else {
                    $row .= isset($rowData[$j]) ? "<td>".$rowData[$j]."</td>" : "<td></td>";
                    $name .= $j == 1 ? $rowData[$j] . ': ' : ($j == 2 ? $rowData[$j] : '');
                }
            }
            $row .= '<td class="w10">
                <span class="btnUpdateName" data-index="'.($max - $i).'" data-index="'.($max - $i).'" data-name="'.$name.'">
                    <span class="spinner-border spinner-border-sm hide loading-del" role="status" aria-hidden="true"></span>
                    <i class="bi bi-pencil-square"></i>
                </span>
                <span class="btnDelRow" data-index="'.($max - $i).'" data-index="'.($max - $i).'">
                    <span class="spinner-border spinner-border-sm hide loading-del" role="status" aria-hidden="true"></span>
                    <i class="bi bi-x-circle c1"></i>
                </span>
            </td>';
            $row .= "</tr>";
        }

        $row = '<table class="table table-success table-bordered table-sm">
                    <thead>
                        <tr>
                            <th class="w0">STT</th>
                            <th class="center" colspan="2">Tên</th>
                            <th>Tiền</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th colspan="4" class="red text-right total">Tổng: <span class="total">'.number_format($total , 0, ',', '.').'₫</span></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>'.$row.'</tbody>
                </table>'; 
        header("Content-Type: application/json");
        resJson(array(
            'sheetData' => $sheetDatas,
            'maxIndex' => $maxIndex,
            'htmlData' => $row
        ));
    } else {
        resJson(array(
            'sheetData' => [],
            'maxIndex' => 0,
            'htmlData' => 'Chưa có dữ liệu'
        ));
    }
} else if($_POST['r'] == 'delSheetRow') {
    try {
        $sheetId = $_POST['sheetId'];
        $indexRow = $_POST['indexRow'];
        $requestBody = new \Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
            "requests" => [
                "deleteDimension" => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'dimension' => "ROWS",
                        'startIndex' => $indexRow - 1,
                        'endIndex' => $indexRow
                    ]
                ]
            ]
        ]);
  
        $response =$service->spreadsheets->batchUpdate($spreadsheetId, $requestBody);
        return true;
    } catch (Exception $e) {}
    return false;
} else if($_POST['r'] == 'addSheetRow') {
    try {  
        $sheetname = $_POST['sheetname'];
        $newRow = [
            $_POST['id'],
            $_POST['prefixname'],
            ucwords($_POST['name'])
        ];
        if(isset($_POST['amount'])) {
            $newRow[] = $_POST['amount'];
        }
        $rows = [$newRow];
        $valueRange = new \Google_Service_Sheets_ValueRange();
        $valueRange->setValues($rows);
        $range = "${sheetname}!A1";
        $options = ['valueInputOption' => 'USER_ENTERED'];
        $service->spreadsheets_values->append($spreadsheetId, $range, $valueRange, $options);
        return true;
    } catch (Exception $e) {}
    return false;
} else if($_POST['r'] == 'updateSheetRow') {
    try {
        $indexRow = $_POST['indexRow'];
        $sheetname = $_POST['sheetname'];
        $updateRow = [
            $_POST['amount']
        ];
        $rows = [$updateRow];
        $valueRange = new \Google_Service_Sheets_ValueRange();
        $valueRange->setValues($rows);
        $range = "$sheetname!D$indexRow:D$indexRow";
        $options = ['valueInputOption' => 'USER_ENTERED'];
        $service->spreadsheets_values->update($spreadsheetId, $range, $valueRange, $options);
        return true;
    } catch (Exception $e) {}
    return false;
} else if($_POST['r'] == 'updateName') {
    try {
        $indexRow = $_POST['indexRow'];
        $sheetname = $_POST['sheetname'];
        $updateRow = [
            $_POST['pref'], $_POST['name']
        ];
        $rows = [$updateRow];
        $valueRange = new \Google_Service_Sheets_ValueRange();
        $valueRange->setValues($rows);
        $range = "$sheetname!B$indexRow:C$indexRow";
        $options = ['valueInputOption' => 'USER_ENTERED'];
        $service->spreadsheets_values->update($spreadsheetId, $range, $valueRange, $options);
        return true;
    } catch (Exception $e) {}
    return false;
}

