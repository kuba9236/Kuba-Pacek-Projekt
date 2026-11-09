<?php
declare(strict_types=1);
require __DIR__ . '/db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error'=>'Niedozwolona metoda.'],405);
$data=jsonInput();
$name=trim((string)($data['customer_name']??''));
$email=trim((string)($data['email']??''));
$phone=trim((string)($data['phone']??''));
$address=trim((string)($data['delivery_address']??''));
$postal=trim((string)($data['delivery_postal_code']??''));
$city=trim((string)($data['delivery_city']??''));
$payment=(string)($data['payment_method']??'');
$items=$data['items']??null;
if (mb_strlen($name)<3 || mb_strlen($name)>150 || !filter_var($email,FILTER_VALIDATE_EMAIL) || mb_strlen($email)>255 || mb_strlen($phone)>40 || mb_strlen($address)<5 || mb_strlen($address)>255 || !preg_match('/^[0-9]{2}-[0-9]{3}$/D',$postal) || mb_strlen($city)<2 || mb_strlen($city)>100) respond(['error'=>'Sprawdź dane dostawy (kod pocztowy: 00-000).'],422);
if (!in_array($payment,['przelew','pobranie'],true)) respond(['error'=>'Wybierz dostępną metodę płatności.'],422);
if (!is_array($items) || count($items)<1 || count($items)>50) respond(['error'=>'Koszyk jest pusty lub za duży.'],422);
$quantities=[];
foreach($items as $item){
 if(!is_array($item) || !isset($item['id'],$item['quantity']) || filter_var($item['id'],FILTER_VALIDATE_INT,['options'=>['min_range'=>1]])===false || filter_var($item['quantity'],FILTER_VALIDATE_INT,['options'=>['min_range'=>1,'max_range'=>100]])===false) respond(['error'=>'Niepoprawna pozycja koszyka.'],422);
 $id=(int)$item['id'];
 $quantities[$id]=($quantities[$id]??0)+(int)$item['quantity'];
 if($quantities[$id]>100) respond(['error'=>'Za duża ilość produktu.'],422);
}
ksort($quantities);
try {
 $pdo->beginTransaction();
 $select=$pdo->prepare('SELECT id,name,price,stock,is_available FROM products WHERE id=? FOR UPDATE');
 $rows=[]; $totalCents=0;
 foreach($quantities as $id=>$qty){
  $select->execute([$id]); $p=$select->fetch();
  if(!$p || !(int)$p['is_available'] || (int)$p['stock']<$qty) throw new DomainException('Produkt jest niedostępny lub brakuje sztuk w magazynie. Odśwież koszyk.');
  $cents=(int)round((float)$p['price']*100);
  $totalCents+=$cents*$qty;
  $rows[]=['id'=>$id,'name'=>$p['name'],'price'=>$p['price'],'quantity'=>$qty];
 }
 if($totalCents<=0 || $totalCents>999999999) throw new DomainException('Nieprawidłowa wartość zamówienia.');
 $status=$payment==='przelew'?'oczekuje_na_platnosc':'nowe';
 $order=$pdo->prepare('INSERT INTO orders (user_id,customer_name,email,phone,delivery_address,delivery_postal_code,delivery_city,payment_method,status,total) VALUES (?,?,?,?,?,?,?,?,?,?)');
 $order->execute([$_SESSION['user_id']??null,$name,$email,$phone?:null,$address,$postal,$city,$payment,$status,number_format($totalCents/100,2,'.','')]);
 $orderId=(int)$pdo->lastInsertId();
 $add=$pdo->prepare('INSERT INTO order_items (order_id,product_id,product_name,unit_price,quantity) VALUES (?,?,?,?,?)');
 $reduce=$pdo->prepare('UPDATE products SET stock=stock-? WHERE id=?');
 foreach($rows as $row){$add->execute([$orderId,$row['id'],$row['name'],$row['price'],$row['quantity']]);$reduce->execute([$row['quantity'],$row['id']]);}
 $pdo->commit();
 respond(['success'=>true,'order_id'=>$orderId,'total'=>number_format($totalCents/100,2,'.',''),'status'=>$status]);
} catch(DomainException $e){if($pdo->inTransaction())$pdo->rollBack();respond(['error'=>$e->getMessage()],409);
} catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();error_log($e->getMessage());respond(['error'=>'Nie udało się zapisać zamówienia. Spróbuj ponownie.'],500);}
