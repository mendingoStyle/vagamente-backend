import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserKeys, UserKeysDocument } from "database/schemas/user_keys.schema";
import { UtilsService } from "modules/utils/utils.service";
import { Model } from "mongoose";
import crypto, { KeyObject, generateKeyPair, createCipheriv, createDecipheriv, } from 'crypto';
import CryptoJS from 'crypto-js';

@Injectable()
export class UserKeysService {
    constructor(
        @InjectModel(UserKeys.name) private userKeysUserKeysModel: Model<UserKeysDocument>,
        private readonly utils: UtilsService,
    ) { }

    async createKeys(user_id: string) {
        if (!user_id) throw this.utils.throwErrorBadReqException('user_id ta vázio')

        const verifyExistKeys = await this.userKeysUserKeysModel.findOne({ user_id: user_id })
        if (verifyExistKeys) {
            return {
                public_key: verifyExistKeys.public_key
            }
        }
        const passphrase = this.generatePassword()
        const promise: any = new Promise(async (resolve, reject) => {
            return generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: process.env.SECRET_PASS_PRIVATE_KEY
                }
            }, async (err, publicKey, privateKey) => {
                if (err) {
                    return resolve(null)
                }
                const buffer = crypto.randomBytes(16)
                const testeDesincripted = 'isso eh um teste'
                const encriptedTeste = this.encripyMessage(testeDesincripted, publicKey)
               
                
                const passEncrypt = this.encryptPass(passphrase, buffer)


                resolve(await this.userKeysUserKeysModel.create(
                    {
                        user_id,
                        private_key: privateKey,
                        public_key: publicKey,
                        created_at: new Date(),
                        updated_at: new Date(),
                    })
                )
            });
        })
        const result = await promise
        if (result === null) throw this.utils.throwErrorBadReqException('Erro ao gerar chaves de usuário');
        return { public_key: result.public_key }
    }

    generatePassword(
        length = 30,
        wishlist = '42324saddsfaaa01dsa@@!#$@#23456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) {
        return Array.from(crypto.webcrypto.getRandomValues(new Uint32Array(length)))
            .map((x) => wishlist[x % wishlist.length])
            .join('')
    }

    encryptPass(message, buffer: Buffer) {
        const cipher = createCipheriv('aes-256-cbc', process.env.SECRET_KEY_ENC_PASS, buffer);
        let encryptedData = cipher.update(message, "utf-8", "hex");

        encryptedData += cipher.final("hex");

        return encryptedData
    }

    decryptPass(encryptedDate, buffer: Buffer) {
        const decipher = createDecipheriv('aes-256-cbc', process.env.SECRET_KEY_ENC_PASS, buffer);

        let decryptedData = decipher.update(encryptedDate, "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return decryptedData;
    }
    encripyMessage(message: string, publicKey: string) {
        const buff = Buffer.from(message, "latin1");
        const encripted = crypto.publicEncrypt(publicKey, buff)
        return encripted.toString('latin1')
    }

    decripyMessage(privateKey: string,  messageEncripted: Buffer) {
        const decrepty = crypto.privateDecrypt({ key: privateKey, passphrase: process.env.SECRET_PASS_PRIVATE_KEY }, messageEncripted)
        return decrepty.toString('latin1')
    }

    encryptMessageAes(message: string) {
        return  CryptoJS.AES.encrypt(message, process.env.CHAT_SECRET_KEY).toString(CryptoJS.format.OpenSSL);
    }

    getPrivateKeys(from_user_id: string, to_user_id: string) {
        return this.userKeysUserKeysModel.find({
            $or: [{ user_id: from_user_id }, { user_id: to_user_id }]
        })
    }

}