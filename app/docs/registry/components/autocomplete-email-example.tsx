'use client';

import React, { useState, useEffect, useRef } from 'react';
import CompleterInputMulti from './input-completion-multiline';
import CompleterInput from './input-completion';


const CompleterExample = () => {
    return (
        <div className="flex flex-col items-end gap-2">
            {/* <input
                type="email"
                placeholder="To: "
                className="p-2 rounded shadow-md"
            />
            <CompleterInput
                context={'The user is writing the subject of an email. Speak in their voice and from their perspective. Keep it short 3-5 words.'}
                placeholder={'Subject: '}
                className={'border rounded border-black w-full shadow-md'}
            /> */}
            <CompleterInputMulti
                context={'The user is writing an email. Speak in their voice and from their perspective.'}
                placeholder={'Type email here...'}
                className={'bg-white rounded w-full shadow-md'}
                multiline={true}
            />
            {/* <button className="bg-blue-500 text-white p-2 rounded shadow-md">Send</button> */}
        </div>
    );
};

export default CompleterExample;