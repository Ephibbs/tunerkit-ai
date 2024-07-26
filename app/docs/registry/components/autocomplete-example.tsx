'use client';

import React, { useState, useEffect, useRef } from 'react';
import CompleterInput from './input-completion';



const CompleterExample = () => {
    return (
        <CompleterInput
            context={''}
            placeholder={'Type here for autocompletion...'}
            className={'rounded w-60'}
        />
    );
};

export default CompleterExample;