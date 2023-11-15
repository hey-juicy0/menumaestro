import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react';
import { getDatabase, ref, get, push } from "firebase/database";
import { useDatabase } from "../contexts";
//*  파이어스토리지 사용 > 따로 추가했습니다. +파이어베이스 참조부분도 변경했습니다 index.jsx참고
import { getStorage, ref as storageReference, uploadBytes, getDownloadURL,} from "firebase/storage";

function MenuAdd() {
  const { database } = useDatabase();
  const dbRef = ref(database, 'addmenu');
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.values(data);
        setMenus(dataArray);
      }
    });
  }, [dbRef]);

  const handleNewMenu = async (e) => {
   e.preventDefault();
 
   const nameValue = e.target.elements.menuName.value.trim();
   const category1Value = e.target.elements.menuCategory1.value;
   const category2Value = e.target.elements.menuCategory2.value;
   const file = e.target.elements.file.files[0];
 
   // 파일이 선택되었을 때만 업로드 수행
   if (file) {
     try {
       console.log("파일 업로드 시작:", file.name);
       const storage = getStorage();
       const storageRef = storageReference(storage, 'adduser/' + file.name);
       //* 이거 파일 겹치면 안되서 영범님은 adduser말고 다른파일명으로 작성해주세요!
 
       // 파일 업로드
       await uploadBytes(storageRef, file);
 
       console.log("파일 업로드 완료. 다운로드 URL 획득 중...");
       // 업로드된 파일의 다운로드 URL 획득
       const fileURL = await getDownloadURL(storageRef);
 
       console.log("다운로드 URL:", fileURL);

       // Realtime Database에 저장
       const newMenu = {
         name: nameValue,
         category1: category1Value,
         category2: category2Value,
         file: fileURL,
       };
 
       const newMenuRef = push(dbRef, newMenu);
       console.log("새로 생성된 데이터의 키:", newMenuRef.key);
     } catch (error) {
       console.error("파일 업로드 또는 데이터 저장 중 오류:", error);
     }
   } else {
     // 파일이 선택되지 않은 경우에는 URL을 null로 저장
     const newMenu = {
       name: nameValue,
       category1: category1Value,
       category2: category2Value,
       file: null,
     };
 
     const newMenuRef = push(dbRef, newMenu);
     console.log("새로 생성된 데이터의 키:", newMenuRef.key);
   }
 
   e.target.reset();
 };
 

  return (
    <>
      <div className="show">
        <h1 style={{ marginLeft: '1.5em' }}>  메뉴 추가</h1>
        <div className="dotted-line-container">
          <div className="dotted-line" />
          <p></p>
        </div>
        <p></p>
        <div className="add-menu-form" >
          <Form onSubmit={handleNewMenu}>
            <div className="box-border" style={{ border: '2px solid black', padding: '15px', borderRadius: '10px' }} >
            <Form.Group className="mb-3" controlId="menuName">
              <Form.Label style={{ fontSize: '1.3em', fontWeight: 'bold' }}>메뉴 이름</Form.Label>
              <Form.Control type="text" placeholder='' required />
              <Form.Text style={{ fontSize: '0.7em', color: 'rgb(67, 200, 208)', fontWeight: 'bold'}}>
                *필수 입력 값입니다.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-1" controlId="menuCategory1">
              <Form.Label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>카테고리 1</Form.Label>
              <Form.Select name="menuCategory1" required>
                <option>선택</option>
                <option>한식</option>
                <option>양식</option>
                <option>아시안식</option>
                <option>중식</option>
                <option>일식</option>
                <option>기타</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="menuCategory2">
              <Form.Label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>카테고리 2</Form.Label>
              <Form.Select name="menuCategory2" required>
                <option>선택</option>
                <option>밥</option>
                <option>면</option>
                <option>찌개</option>
                <option>육류</option>
                <option>기타</option>
              </Form.Select>
            </Form.Group>
           

            <Form.Group className="position-relative mb-3">
              <Form.Label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>사진</Form.Label>
              <Form.Control type="file" name="file" />
            </Form.Group>
            </div>

            <p></p>
            <Button variant="primary" type="submit" style={{ backgroundColor: 'rgb(67, 200, 208)', border: '2px solid rgb(67, 200, 208)' }}>
              추 가 하 기
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default MenuAdd;
