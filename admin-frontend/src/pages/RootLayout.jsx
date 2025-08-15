import React, {Suspense} from 'react';
import  {Outlet} from 'react-router-dom';
const RootLayout = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
            </Suspense>
        </div>
    );
};

export default RootLayout;