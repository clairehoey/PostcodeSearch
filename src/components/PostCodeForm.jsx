
import '../App.css';
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import { jsonToPlainText } from "json-to-plain-text";

function PostCodeForm() {

    const [postCode, setPostCode] = useState("");
    const [partialPostCodeResponse, setPartialPostCodeResponse] = useState([]);
    const [postCodeInformation, setPostCodeInformation] = useState("");
    const [bulkPostCodeInformation, setBulkPostCodeInformation] = useState("");
    const [isInvalidPostCode, setIsInvalidPostCode] = useState(false);

    async function autoCompletePostCode(partialPostCode) {

        //check to prevent a null API request
        if(partialPostCode.length > 0){
            const url = "https://api.postcodes.io/postcodes/" + partialPostCode + "/autocomplete";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
                }
            
                const json = await response.json();
                setPartialPostCodeResponse(json.result);
            } 
            catch (error) {
                console.error(error.message);
            }
        }
    };

    function validateEnteredPostCode() {
        let postcode = postCode;
        var regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
        if(regex.test(postcode)){
            getPostCodeDetails();
            setIsInvalidPostCode(false);
        }
        else{
            setIsInvalidPostCode(true);
            setPartialPostCodeResponse([]);
        }
    };
      
    async function getPostCodeDetails() {

        const url = "https://api.postcodes.io/postcodes/" + postCode;
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        
            const json = await response.json();
            adjustReturnedPostCodeDetails(json.result);
        } 
        catch (error) {
            console.error(error.message);
        }
    };

    function adjustReturnedPostCodeDetails(returnedDetails) {
        let readableReturnedDetails = jsonToPlainText(returnedDetails);
        setBulkPostCodeInformation(readableReturnedDetails);
        setPostCodeInformation(returnedDetails);
    };

    return (
        <div>
            <InputGroup>
                <Form.Control
                    type="text"
                    value={postCode}
                    onChange={e => (setPostCode(e.target.value), autoCompletePostCode(e.target.value))}
                />
                 {/* left validation on postcode until 'submit' button because it's hateful to be corrected when you're not finished typing  */}
                <Button variant="primary" type="submit" onClick={validateEnteredPostCode}>
                    Submit
                </Button>
            </InputGroup>

            <Dropdown>
                {/* .length was breaking if no partial code response was found - added a check to allow it to be ignored  */}
                <Dropdown.Menu show={partialPostCodeResponse?.length > 0} onClick={e => setPostCode(e.target.innerText)}>
                    {partialPostCodeResponse?.map((partialPostCode) => 
                        <Dropdown.Item>{partialPostCode}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            <Alert style={{ marginTop: 5 }} show={isInvalidPostCode && partialPostCodeResponse?.length < 1} key='warning' variant='warning'>
                Not a valid UK post code.  Please search again.
            </Alert>

            <h6 style={{ marginTop: 20, marginBottom: 20 }}>Post Code Information</h6>
            <p style={postCodeInformation.length < 1 ? {display:'none'} : {display:'block'}}>Country: {postCodeInformation.country}</p>
            <p style={postCodeInformation.length < 1 ? {display:'none'} : {display:'block'}}>Incode: {postCodeInformation.incode}</p>
            <p style={postCodeInformation.length < 1 ? {display:'none'} : {display:'block'}}>Outcode: {postCodeInformation.outcode}</p>
            <Form.Group >
                <Form.Control style={{ width: 450 }} as="textarea" rows={10} value={bulkPostCodeInformation} readOnly/>
            </Form.Group>     
        </div>    
    );
}
  
export default PostCodeForm;