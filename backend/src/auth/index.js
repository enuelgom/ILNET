import "@babel/polyfill";
import jwt from 'jsonwebtoken';

const verifyExp = (token) => {
    const decoded = jwt.decode(token);
    const dateNow = new Date();
    const dateExp = new Date(0);
    try {
        dateExp.setUTCSeconds(decoded.exp);
        const expired = dateNow.valueOf() > dateExp.valueOf() ? true : false;
        return expired;
    } catch{
        return true;
    }
}

export {verifyExp};