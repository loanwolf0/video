import React from 'react'

function LogoWithText({ height, width, viewBox,classname }) {
    return (
        <svg className={classname || "logo-text"} xmlns="http://www.w3.org/2000/svg" width={width || "213"} height={height || "74"} viewBox={viewBox || "0 0 213 74"}  fill="none">
            <path d="M0.869873 39.4507C1.86195 39.4507 2.85402 38.4579 2.85402 37.4662V1.99953C2.85402 1.00751 2.10997 0.0153801 0.869873 0.0152589H38.5687C38.5687 3.98368 39.5608 6.9599 40.5528 7.95197C38.5687 5.96782 36.4605 5.96782 32.6162 5.96782H14.7589C12.7748 5.96782 10.7906 7.45606 10.7906 9.44008V14.0115C10.7906 15.1445 10.7906 15.8884 12.7748 15.8884H26.6638C30.6321 15.8884 32.6164 15.8884 34.6004 13.9044C33.6083 14.8965 32.6162 17.8727 32.6162 21.8414H14.9503C12.9661 21.8414 10.7907 23.596 10.7907 25.5612V37.4662C10.7907 38.4579 11.7827 39.4507 12.7748 39.4507H0.869873Z" fill="#17191C" />
            <path d="M59.8137 39.4507C57.2334 39.4507 54.9645 39.0062 53.0071 38.1173C51.0941 37.1839 49.6038 35.606 48.5361 33.3836C47.5129 31.1167 47.0013 27.9832 47.0013 23.9829V9.93612C47.0013 8.94404 46.354 7.95197 45.0172 7.95197H55.5366C54.0668 7.95197 53.6765 9.1031 53.6765 9.93612L53.7411 24.9163C53.7411 28.6943 54.4085 31.2723 55.7431 32.6502C57.0777 34.0281 58.835 34.717 61.0148 34.717C63.1947 34.717 65.0854 34.1836 66.687 33.1169C68.2885 32.0502 69.4813 30.5835 70.371 28.7167C71.3053 26.8499 71.7724 24.7386 71.7724 22.3829V9.93612C71.7724 8.94404 70.7897 7.9521 69.7977 7.9521H78.4783V37.4662C78.4783 38.4582 79.4704 39.4503 80.4625 39.4503H71.7818V33.2499C71.5149 33.7832 71.0606 34.4727 70.4378 35.1838C69.8149 35.8506 69.1159 36.5171 68.0216 37.1839C67.0429 37.8506 65.8639 38.384 64.4848 38.784C63.1057 39.2285 61.5487 39.4507 59.8137 39.4507Z" fill="#17191C" />
            <path d="M102.947 39.4502C98.765 39.4502 95.2505 39.2279 92.4033 38.7835C89.6006 38.339 87.7075 37.9106 86.6843 37.4662C86.6843 35.73 86.3122 33.0018 85.4442 30.5216C86.6008 31.4551 88.444 32.2941 91.3356 33.3164C94.2718 34.2942 97.8308 34.7832 102.013 34.7832C104.771 34.7832 106.839 34.6054 108.219 34.2498C109.598 33.8498 110.51 33.3386 110.955 32.7164C111.399 32.0496 111.622 31.3162 111.622 30.5162C111.622 29.5828 111.288 28.8494 110.621 28.316C109.998 27.7382 108.797 27.2715 107.017 26.9159C105.282 26.5159 102.702 26.1159 99.2766 25.7158C95.5397 25.2714 92.648 24.6269 90.6016 23.7824C88.5997 22.9378 87.2206 21.8711 86.4643 20.5821C85.708 19.2487 85.3298 17.6708 85.3298 15.8484C85.3298 14.4261 85.708 13.026 86.4643 11.6481C87.2206 10.2702 88.6219 9.13682 90.6683 8.24786C92.7592 7.35891 95.7176 6.91443 99.5436 6.91443C103.681 6.91443 107.151 7.13667 109.954 7.58115C112.801 8.02562 114.679 8.49957 115.702 8.94404C115.702 10.1841 115.702 13.5324 117.094 15.3151C115.982 14.515 113.957 13.6927 111.021 12.8482C108.085 12.0037 104.548 11.5814 100.411 11.5814C97.119 11.5814 94.9169 11.9593 93.8047 12.7149C92.6925 13.426 92.1364 14.3594 92.1364 15.5151C92.1364 16.1818 92.2699 16.7818 92.5368 17.3152C92.8037 17.8041 93.3376 18.2486 94.1383 18.6486C94.9836 19.0487 96.2293 19.4043 97.8753 19.7154C99.5658 20.0265 101.812 20.3377 104.615 20.6488C108.397 21.0488 111.266 21.6711 113.223 22.5156C115.181 23.3601 116.515 24.4268 117.227 25.7158C117.984 26.9604 118.362 28.4272 118.362 30.1162C118.362 31.9385 117.85 33.5609 116.827 34.9832C115.848 36.3611 114.224 37.45 111.956 38.2501C109.687 39.0502 106.684 39.4502 102.947 39.4502Z" fill="#17191C" />
            <path d="M123.37 39.4502C124.362 39.4502 125.375 38.7063 125.354 37.4662L125.106 11.9203C125.106 10.9282 124.114 9.93612 123.122 9.93612H131.802L132.072 37.4662C132.072 38.4582 133.042 39.4502 134.034 39.4502H123.37ZM127.792 7.33388C126.502 7.33388 125.501 6.9783 124.789 6.26713C124.077 5.51152 123.721 4.64479 123.721 3.66694C123.721 2.64464 124.055 1.77791 124.722 1.06674C125.434 0.355581 126.457 0 127.792 0C129.126 0 130.127 0.355581 130.795 1.06674C131.506 1.77791 131.862 2.64464 131.862 3.66694C131.862 4.64479 131.506 5.51152 130.795 6.26713C130.083 6.9783 129.082 7.33388 127.792 7.33388Z" fill="#17191C" />
            <path d="M155.388 39.4502C150.939 39.4502 147.447 38.739 144.911 37.3167C142.42 35.8944 140.662 33.9609 139.639 31.5163C138.66 29.0716 138.171 26.3159 138.171 23.249C138.171 20.1376 138.683 17.3597 139.706 14.915C140.773 12.4704 142.553 10.5369 145.044 9.11459C147.536 7.64782 150.983 6.91443 155.388 6.91443C159.792 6.91443 163.24 7.64782 165.731 9.11459C168.222 10.5369 169.979 12.4704 171.003 14.915C172.07 17.3597 172.604 20.1376 172.604 23.249C172.604 26.3159 172.093 29.0716 171.069 31.5163C170.091 33.9609 168.356 35.8944 165.864 37.3167C163.373 38.739 159.881 39.4502 155.388 39.4502ZM155.388 34.7165C158.146 34.7165 160.281 34.272 161.794 33.3831C163.306 32.4941 164.352 31.2051 164.93 29.5161C165.508 27.7827 165.798 25.6936 165.798 23.249C165.798 20.8044 165.486 18.7153 164.863 16.9818C164.285 15.2484 163.24 13.915 161.727 12.9815C160.259 12.0481 158.146 11.5814 155.388 11.5814C152.674 11.5814 150.561 12.0704 149.048 13.0482C147.536 13.9816 146.468 15.3373 145.845 17.1152C145.267 18.8487 144.978 20.9155 144.978 23.3157C144.978 25.6714 145.267 27.716 145.845 29.4494C146.423 31.1385 147.469 32.4497 148.981 33.3831C150.494 34.272 152.629 34.7165 155.388 34.7165Z" fill="#17191C" />
            <path d="M177.19 39.4503C178.182 39.4503 179.174 38.4582 179.174 37.4662V10.6802C179.174 9.6881 178.182 8.69603 177.19 8.69603C179.174 8.69603 183.886 7.95197 185.87 6.9599V12.4163C186.538 11.5718 187.463 10.6778 188.487 9.9222C189.554 9.16659 190.867 8.54432 192.424 8.0554C193.981 7.52202 195.805 7.25534 197.896 7.25534C202.033 7.25534 205.192 8.4332 207.372 10.7889C209.596 13.1447 210.672 16.8184 210.672 21.841L210.708 37.4662C210.708 38.4582 211.664 39.4503 212.656 39.4503H201.992C202.984 39.4503 203.976 38.7063 203.976 37.4662V21.841C203.976 19.2186 203.568 17.3894 202.901 15.9227C202.233 14.4559 201.299 13.4336 200.098 12.8558C198.941 12.2335 197.584 11.9223 196.027 11.9223C194.381 11.9223 192.78 12.2779 191.223 12.9891C189.666 13.7003 188.398 14.8337 187.419 16.3894C186.44 17.945 185.87 19.2186 185.87 21.841V37.4662C185.87 38.4582 186.862 39.4503 187.854 39.4503H177.19Z" fill="#17191C" />
            <path d="M1.36581 73.429V72.9925C1.63036 72.4369 2.26529 71.4845 3.27059 70.1353C4.30234 68.7596 5.7177 67.1459 7.51666 65.294C8.46905 64.2887 9.40822 63.376 10.3342 62.5559C11.2865 61.7357 12.1331 60.9553 12.8739 60.2146C13.6411 59.4474 14.2495 58.6934 14.6993 57.9526C15.1755 57.2119 15.4136 56.4315 15.4136 55.6113C15.4136 54.606 15.1093 53.8256 14.5009 53.27C13.8924 52.688 12.8871 52.397 11.485 52.397C10.2151 52.397 9.02462 52.5954 7.91349 52.9923C6.80237 53.3891 5.8103 53.8785 4.93727 54.4605C4.0907 55.0161 3.42932 55.5584 2.95312 56.0875V55.2939L2.15946 51.6034C2.71503 51.0743 3.78647 50.5452 5.37378 50.016C6.9611 49.4869 8.97171 49.2224 11.4056 49.2224C13.5485 49.2224 15.2284 49.5002 16.4453 50.0557C17.6887 50.6113 18.5618 51.3388 19.0644 52.2383C19.5935 53.1113 19.8581 54.0373 19.8581 55.0161C19.8581 56.4182 19.5274 57.7013 18.866 58.8653C18.2046 60.0029 17.3184 61.114 16.2072 62.1987C15.1226 63.2569 13.9188 64.368 12.5961 65.5321C11.2204 66.7226 10.0299 67.7146 9.02462 68.5083C8.01931 69.2755 7.29179 69.8046 6.84205 70.0956V70.2147H15.4929C17.0803 70.2147 18.3766 70.0824 19.3819 69.8178C20.4136 69.5533 21.1015 69.2887 21.4454 69.0242C20.8353 70.5767 20.6517 71.4447 20.6517 73.429H1.36581Z" fill="#17191C" />
            <path d="M37.3349 73.3299C37.5201 73.3299 37.692 73.1447 37.8508 72.7743C38.0359 72.4039 38.1285 71.7955 38.1285 70.9489V68.7663H23.049C23.1284 68.5812 23.2871 68.3034 23.5252 67.933C23.7898 67.5362 24.1072 67.0864 24.4776 66.5838C24.8744 66.0282 25.4432 65.2478 26.184 64.2425C26.9247 63.2372 27.7448 62.0996 28.6443 60.8298C29.5438 59.5599 30.43 58.2636 31.3031 56.9408C32.2026 55.6181 32.9962 54.3747 33.6841 53.2106C34.5306 51.8349 35.0465 50.8693 35.2317 50.3138C35.4169 49.7582 35.4433 49.4937 35.3111 49.5201H43.4064C43.2212 49.5201 43.036 49.7053 42.8508 50.0757C42.6921 50.446 42.6127 51.0677 42.6127 51.9408L42.573 65.5917H43.0095C44.5704 65.5917 45.8138 65.4991 46.7397 65.3139C47.6921 65.1287 48.3006 64.9435 48.5652 64.7584L47.7715 67.9727V68.7663H42.573V70.9489C42.573 71.7955 42.6656 72.4039 42.8508 72.7743C43.036 73.1447 43.2212 73.3299 43.4064 73.3299H37.3349ZM29.1205 65.5917H38.1285V51.9408H38.0492C37.7317 52.6286 37.2952 53.4487 36.7396 54.4011C36.1841 55.3535 35.5756 56.3588 34.9142 57.417C34.2528 58.4752 33.565 59.5202 32.8507 60.552C32.1629 61.5837 31.4883 62.5361 30.8269 63.4091C30.192 64.2557 29.6232 64.9436 29.1205 65.4727V65.5917Z" fill="#17191C" />
            <path d="M49.2829 73.3299C49.5739 73.3299 49.9972 73.1447 50.5527 72.7743C51.1083 72.4039 51.7167 71.8087 52.3781 70.9886C52.8808 70.3801 53.4628 69.6526 54.1242 68.806C54.812 67.9595 55.4999 67.1129 56.1877 66.2663C56.8755 65.3933 57.484 64.6393 58.0131 64.0044C57.5898 63.5282 57.1136 62.9991 56.5845 62.4171C56.0554 61.8086 55.5131 61.1869 54.9575 60.552C54.4284 59.917 53.9125 59.3086 53.4099 58.7266C52.9072 58.1445 52.4707 57.6419 52.1003 57.2186C51.3596 56.3456 50.7511 55.7239 50.2749 55.3535C49.7987 54.9831 49.468 54.7847 49.2829 54.7583H55.7909C55.5792 54.7847 55.4866 54.9964 55.5131 55.3932C55.566 55.7636 55.9231 56.372 56.5845 57.2186C56.8755 57.589 57.2591 58.0652 57.7353 58.6472C58.2115 59.2027 58.7142 59.7715 59.2433 60.3536C59.7724 60.9356 60.2486 61.4647 60.6719 61.9409H60.7512C61.1216 61.4911 61.5449 60.9753 62.0211 60.3932C62.5237 59.8112 63.0132 59.2292 63.4894 58.6472C63.992 58.0652 64.4021 57.5625 64.7195 57.1392C65.3545 56.2927 65.6984 55.6842 65.7513 55.3138C65.8042 54.9434 65.7248 54.7583 65.5132 54.7583H72.1403C71.8757 54.7583 71.4656 54.9434 70.9101 55.3138C70.381 55.6577 69.7725 56.253 69.0847 57.0996C68.6085 57.708 68.0132 58.4355 67.2989 59.2821C66.5846 60.1022 65.8571 60.9356 65.1164 61.7821C64.4021 62.6287 63.7539 63.3695 63.1719 64.0044C63.7539 64.6129 64.4285 65.3404 65.1957 66.187C65.9629 67.0071 66.7169 67.8404 67.4577 68.687C68.1984 69.5071 68.8069 70.2346 69.2831 70.8695C69.9974 71.769 70.6058 72.4039 71.1085 72.7743C71.6111 73.1447 71.9551 73.3299 72.1403 73.3299H65.6322C65.8703 73.3299 65.9629 73.1447 65.91 72.7743C65.8836 72.4039 65.5264 71.769 64.8386 70.8695C64.5476 70.4727 64.1507 69.9833 63.6481 69.4013C63.1454 68.8193 62.6163 68.2108 62.0608 67.5759C61.5317 66.9409 61.0422 66.3854 60.5925 65.9092H60.5131C60.1428 66.3854 59.7062 66.9409 59.2036 67.5759C58.7009 68.2108 58.2115 68.8325 57.7353 69.4409C57.2856 70.023 56.902 70.5256 56.5845 70.9489C55.9231 71.7955 55.566 72.4039 55.5131 72.7743C55.4866 73.1447 55.5792 73.3299 55.7909 73.3299H49.2829Z" fill="#17191C" />
            <path d="M77.9656 73.3299C78.1243 73.3034 78.4153 73.0124 78.8386 72.4569C79.2619 71.8748 79.7778 70.896 80.3862 69.5203C80.8095 68.5944 81.2064 67.6817 81.5767 66.7822C81.9471 65.8563 82.3175 64.9171 82.6879 63.9647C83.0582 63.0123 83.4683 62.0202 83.918 60.9885C84.5794 59.4541 85.2276 58.1578 85.8625 57.0996C86.5239 56.0413 87.1191 55.1683 87.6482 54.4805C88.2038 53.7662 88.6668 53.1974 89.0371 52.7741V52.6947H78.4021C76.6825 52.6947 75.4523 52.8799 74.7116 53.2503C73.9973 53.5942 73.6401 53.9381 73.6401 54.2821V49.5201H94.8705C94.6324 49.7847 94.3017 50.2079 93.8784 50.79C93.4816 51.3455 93.098 51.9275 92.7276 52.536C92.4895 52.9064 92.1456 53.5545 91.6959 54.4805C91.2726 55.38 90.7832 56.4382 90.2276 57.6551C89.6985 58.8456 89.1429 60.1022 88.5609 61.425C88.0054 62.7478 87.4763 64.0308 86.9736 65.2742C86.471 66.5176 86.0477 67.6288 85.7038 68.6076C85.3598 69.5865 85.135 70.3272 85.0291 70.8299C84.844 71.7558 84.7646 72.4039 84.791 72.7743C84.844 73.1447 84.9233 73.3299 85.0291 73.3299H77.9656Z" fill="#17191C" />
        </svg>
    )
}

export default LogoWithText