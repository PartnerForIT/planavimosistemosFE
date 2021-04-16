/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

export default ({ fill }) => (
  <SvgIcon viewBox='0 0 14.498 22.003'>
    <defs>
      <pattern id='pattern' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 149 198'>
        <image width='149' height='198' xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJUAAADGCAYAAADbuMIWAAAAAXNSR0IB2cksfwAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAAEsAAAAAQAAASwAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAJWgAwAEAAAAAQAAAMYAAAAAKa6YcwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAGeNJREFUeAHtXX2QFMd17947xIdwGSU4kV3YAYSTWIV8KGAnkkgJEqUqpcjBKSqx40AJRVIcCDGfQo7hdtk9SMmIj0PCoJTkErKIU6mSKlCK/EfKEdg56xMlYJBcKgmjlJEsJ7IsRUiAuN3O783u3u3N7uz09MdMz+5scexMf7x+7/Vvu3tev9fDK5UK68TPX28qTpzI+GWCsymci49wxq+CnJcLxj7BGZvOmOhhjJdJdiFEjqMQLl/D3xkkvA6tvID8n1S4eOeDCnvrvi2Fc1Q2+4RrgHcSqNZt3TZJnD/3Rcb5CsHE3HDx5UsAlM8DbHsZZwd3lgpvydfsvpKpB9XyvQ/3THjj9DIuxAqMSr8VRxdiVHtRVMTecTn2wLZi4UIcbaapjdSCanW+tIQzsQLKviZJhWMEew7T595dA4X9SfLhUtupA5UrYPJ3IsD1DNZhewZL+QP+vG67Tw2o1m4qzRBcPIw1zXVOd5JgP8A0vHywVDjhNJ8WmXMeVLlD7/DVRwe/go4atKgH86QFy4+fMGHXXRvvPGueuNsUnQbV2nzxs3jOfwAqJHNAGj8/ZoLdjvXWE2lkXpXnnGpF2/XW9BdvA6CeQTtpBRSpaCam639fky/dYVtfLtF3bqRaXyh+qCL4YdN2pqSVDoPrsd4y/71tW/O/SJoX2+07NVKt21SaVhbseKcBijoRo+6c4R52fHV/6UrbnZo0fWdGqnX9xU9XODsMhfxS0kqx3P4wNoR+f+dA4fuW20mMvBOgWp0vXoUh8yn8mi9NTBMxN5wTbOGOgcKRmJuNpbnEpz884fV1G6CoZ2lUXpMvXh9LL8fcSKIj1bp88aOwQh+HzB+JWW5XmisLzucNFvPHXGHIBB+JjVTrvrbxwxXGn4IQ3Qoo6r8erK+ewGj9cROd6QqNxEAlei6BQVD8miuKSI4PcRnWkk+Q205yPJhtudcsOTlqa/OllXG5qdQ4egobvoeEYKd4Dz8xXC5fgM/VRV4e9pz0cnxcrhf/Lg5XJsPzYRZsSjNgtPwzdPa1chJpl5pVOX/u30BlvjYlBwjEvqbC4nQe5H4uBtlPC8bzOSa+o+pUt6FQHH9RMFpMb8Nfn22ewe/STvByiBVUf7OxMG58Tw8ZNz9lr4P40zkuVuwoFv7LZBurNpWu6Mmx5eB9nUm6Plqv93LWd3ex8KYvPVW3sU5/43O5O2wBCtPbj6D5u3aW8t+y0QO7t+RPge76tf2l/QwuOJga51ho52PDgj0Our9tgXZsJGMbqfCEMwsd8bIdyfiqD8rlfd/YWrxoh34zVawLv4wfyHbkTG7O1UuBnv4S/lgP6lFJrnaMoCo9jU4w/Qv8KSzTfwjL9A+TUCF2AmZiUX8QbRv1pCAf+Jnjed/Kr/UPJyGXbpuxmBTgxrLMNKAw3T3Penr7kgIUKR6jyY93z13dB1vTf+p2RGN9+LxfeepcZXljWpquYwEVfnkUoGDycxRrp3m7Chv/1yRRFVqVRR8W2ByeC5B/VaV+UB3O2Z1Bea6nW5/+aJSCzcfk+uDorlLhM1EVe0ehOHVY8EWYrmALEnOwbmlaaJPPE2xZQ7BhHdlVyj8atQ04490N2uuj1gsqD6Aux4/nvqB8V9OtgwoL2mcx9UUGQYDCTvfgkXt7sfBuQH5T8tpC6QYEgd4MEC1pymyfcBZOUPthO9o3OJB/sX3R0VwAC1OhuHo0RevqBH5An9aikEBlq6CqGQ/PG5LrAs/l+nZu7n9Jhh45wyGSvYSyi2XKh5RZnxs/cd+OjRveDynHVm3sv7ynpxe2OPYrYWVl8tNoELW6proo+JdlFCdTBlPBKmlAUaApF+T9YAJQxN72yoVzxzGVh26j7N468AbOYDA4BXoBszIqcqaMVVBhGjCyQKe1DtYW/yCjNUy327F/9zDKmjbszsLaED5QpZvC+ACvD4PnJ8PKSeZfQ6H9kmWdKGYNVGuKW8ml5TdMSAkXmR0ydAhQWL/Z3EYBUMVjMiMWr/AvYMQyMvVP+tnpqOtBGXVZK2MNVLxcNjP1IOJXZpOVwuEtA2q0EzBihQUw7NiSpyOJtoxWUr+q4PAR9drx17QGKnSwEUXkOPuLMLXQyFGb8sKKmsrHvq/YHUYMtqZ9YWUk8z97+9r1l0iWTbyYFVCRVyckM7F18eyOUuG/Q7XEuanOC21qpABnN2A/80sj9y0uPJcbhL+3yIqcNPnSD10WuVJCFayA6mLPOCMKwOP0vWF6gX/WjVjnzA4rZyMf/H09jC4UfCisjEw+2vplmXIulLECql4zChAyaykshkM71p6ixTQ8Dd7ajj7tTcIc8mq7MjJ5eJq8UqacC2WsgArbHPoKEOwbYQoid5qkRqkG3jY3XLe8hCF0b8uMSIkCsqbjYwdUQl8B+GWGem5in+7m5NVMo5XnIh3IChbsQ4GZkhnYlE/Ndo0VUCGoQdtdGMGWoX7sUPQCyT6xXez6dg2IMgt/2GhHwMtLT+SRFVBhnTM1VEchBWA8/HlIEez3itBtk7Y0BNuD/CJGxQNty4VnLmhXJJfDmKr5AYEZmiRiq95rpyWhDaqwjlhdKM0BGFQ/w0DkQhxGNjItwRr/DEAa+rQZ0GBbcPeU+flKjx6uIOuUgLadS7Y0UrFP6Eo6XEYIQJtPT0XoKPmrjYCiZrBfh1GLn2zTZLustrxUesVwu8oyeVCGF6MoUzbpMrZA5fQGKPzan2+tePFo6/Tw1K/0b24LrHAKnVPCFqi0NZS7ZEJqfpnawnYYAVug0qZb+eC806OdHwf3DGx+25/WrffanR+guNcD0rsy+b0yPLE0PyCQmh+ZLVBpR7nQoRma/eBM9QmcTdRlBgv1C7o04qpvpeOw1/ULXQF4TkzSpeFKfbjvmNDzT1yRJ4wPE8I2tYHT8bTD2/HL/PUmwilNKHP+q7qs44d6WpdGXPWtgApEX9EVAFG/c3RpuFKfV4QJWbR1Gpc+rIAKlukT2gJwfrs2DUcIYENZXxYhXnBEnFA2rIAK8XkIU9L7AJjT6Wx1PSrJ196wsUTHL+qfyMeZqrU/diVYAZXgubdMSIK12SITdJKkgbc8/KmJ9oeF+B8TdOKgYQVUV4yraD/9ecJzVqQo5zgUYasNjFL9JmhPmjDxTRN04qBhBVTVc5X40wYE4DhUY7kBOomQQJTPbfBMnabbOAyfx9L03kAroCIlQhEGXGjRJUxsoBNbdDsm7voUVQwnwnVm2uVGdGmGl3Aq1kB17vIZ3w5vXqrER/FahH+RKulQoYlvnKZDZ3/TBEvnKuKfTdCJi4Y1UO1bsZS8DJ4yIQg6Zz6mktCgUhNtmaBBr5gDz0UTtDDm/3DflsL/maEVDxVroCL2EatmbNjGVLKRjsyORy16rVRygkZWI6+YM7WM0JMoWm2roKrF7UmdJxXGNn75n7qkp+fvwsolnQ+35L8CD/NM8TFzAr/fFK246FgFVVUIc6MVxr5i9YkqLvVEawe8/THAL3XkkQxljFJP4kka5rp0fayDis43h3JeM6YWzu53cX2F468X4ZHXSIh7XVeIwTG2fKjTjOPbOqi8A/MFwwGrBj+cHcB78gYMUtQmhR/OQW0iDQTglTCE4Ix/bEhKzaV1UJEm3n3vXbOjFWjSE2FqtBydUVEuXzSyvRO9af0asYDq/p3bP6gItlWf3W6hwFdXzw5Np7yxgIpUMzhQwBlSPJHXfaSpazDtvUzr0DTx7Oc1NlBRw1h4/rmfgey+SQMDcb64qal1Awmxgqp6yD1fZYDvjiRBJgQ62TjtwsUKKlIWXs9xD76eTbviTPOPae9HF8qVBabpJkEvdlCRkGj08/jSDuNKQmG22uRCfDHt015dN4mACofD/hTQImBlH9KAYEuSfMWc6U5IBFQkxK5S/5NQ5i2mBUobvTQbOYN0nRioiCFYjPdDqc8EMdfp6SQ7Fua/22lyJgoqUiaU+jsYsX7QaYqVkOfE4NxV10iUS12RxEFFGsOIhS0XIz7tqegAmA6O0Wty6a2mqWA4IpNOgIp4hqnhmu4YsfjTeBPE1Z0KKOpLZ0DlAQsjFrxFl+KX/B7dd9onx/ky78fTaYL55HEKVMQbeYuWK7wP7sMv+nhN7S0W5C/DVefqHcX8Q6kVIgLjzoGKeN+9JX9q5njeh8vNdJ/qD47Vfr8i+gaL+WOpliMC85aOvI7AQUDRakAqK+JVId/HIv6f4D+lfRxPQFO2kitM8C/sGsg/YqsBV+k6OVI1KguL2sNCCBq1ivg725jn6jWmu71c8L5uBBT1ibMjVSNgYHL4Ge430x8dyo8jq+djr+wkXjVyuLFcste8AN+eobPvvTtETonJ8pJs66kAVaOKamuTYzhmaEFjetLXeKorJc2DK+07P/25oqiMD3kNZKCS11VWUlIDGagkFZUVk9dA6tZU8qLFWxLh7g9iI2863gI/Bd9z0PrbMIVUbVNYwGOX4PmeHBu6u1hIzeFlqhrMQKWqOV892NGWUVLDDvEU3C2gNEQuL6B0ei8Y3mL6r0g4iIX9N728DvwvA1X8nXoTwHYTXui9GSaI/TCQ7tu1Jf96/GzYazFbU9nTbQhlHNvI2SaWE6/hbIiBNZtKHwupkJrsDFQudFWHgSsDlQugqvPQIeDKQFXvUJe+Uw6uDFQugcnPS0rBlYHK35Eu3qcMXNomBfIa8L95fcbE3FDNH8rFLkovTwQuLjbhaXGLy6aIyKCC8W4eLHyL4O4Lg56YD0sxgwvKmM+p8xUG57pjOOVlCI/ND+0qFY6OKZDd6GnAcXBJgwpguhGW4K9DG7MBFOCqwXbcQkXInYNytF2xEoa+M/je3MlW5BYqsJ/kKLhC11QEJoCC3t/3OKA0W01T9H4W8QDRqYJTjYr1WoK9ar0NGw04tuZqCypskq6EDjTA5NegB8rHQXeTP8eFe7zsccgFPpR5cARcgaBCx2/HFHevsoBtKoLuAEasR9oUSSQL/vCvYIo/qdM4/NMBTH6k9kfTfvyfhMHV20riGqAMvQGqVQte2mIA6zks4j8TWCKRDHEnmsXoHOXjAXGwl4tDdxfzbzbWrE73tBZVXTo0Uot4ndCai1cqY18oQFOerREqQCVHheA3V49uDCjRIpl81FUDHxA4sRDnQR1pQdZLWp0vLYFflMwxifBm4bfUXpcSRM5LTxRcdc4Ei8UUMWb6g/0DYed2pry6XC2+53EujlPbLfISSaqChH8OU1i76eub+DH0yQCKhMCI/B08/V4FU8wf4OH5QCKCxTQtjhmpqk95CQzTVQ0Pw0qxEOFYQzIKtzlSNbYPnSyG39N8xjmZRzCLCbK9HdK1va3JD1zLWQXvBGRLGtuL9drSyDUCqurwHHUtYVwFwxgd/gS/aHhHtv/EBar2XOjndiK4GqY/z7CpryU9CnhwEI/RmkaPTHpq0zGVeOpcigN4ruuUadEDFbZUZiXydBLQ97RI7iZgkRo6CVweqDCvLwro38SSCVhk2kiMgYQa7gRw1ae/BQnpsG2zeBJd143AIqWkGVx1UOk8zmNxzdaT7QeL7NtwTffGPt0MLFKiQ+B6SXZJwu/ZUuyFq8pFRRQ0mQFW95euhN3pIdCbp0gzqNrRRut7pzz9BQkblJ7406Jg34XBd1U7Y3Xu9LmK+igl2H1+uxI1Vuv8o0GKUUyfR9s6inU7plriIxdnN4QZq+vTn5rSOft5UEUPWEB1UL5iOoAF9xmHrO+KcmhXSxhcvTAAHw7qh1w5x99WlRB2lSva1cUohi0JvqNdmeh5sPg7ddhZdAlM1kgQXIHA8izqmFbau3G21ULuOhKsXRFLXg/0QABjafRP2IZydIru1EhgzfVKbvzEvh0bN7xf14I3/WE0ebWeEP27sjasDl4Vsh5t/G1YuYj5SoCK2Ebqiicwcs0SF86PwUBtTYVNUvXPYljkvxRWHcDaQwfvh5XL8s1oIE5wwewDp8uBa+uce6BCZx+pJ6h8o/5umQMmyE0kA5aKhtXrjIKL/RHsiFpere24II+Ler4HKvJYrCeofYupPMfGDIFBdGr+RxDQrJE0qL0svaoBPI17/ly4swIucuEhGyW15oGqdrpbqLtJlb3W/5Plu+Y+07pAQyoJSL5TSDJqfW9oIrsM0IBNcGG/1hutamsqj4N9AXxESJZ3n/GMptWtnTE+3REay4pqaMAKuDj/PLE04qRHNxhpHsHXYrpW/dBTHi3KZet7a7GcN/2a3tYJZKGTTQqBQodkVGcZ/QAN2C4/2ThSodnczpC2Q7MxDd5bn1tDC6MAHU2IXw1F1Jje1pFpPitT00B95NI1VuOog/ljQEVPCibsSdgbKkXtrRqwOvZw1aj6SKo82RTRtk4/9I0BFQlSnbq0Hz0R01e6KapiAKzbdH8pUdvMyjdrAFPYXc2pkikIEGkCVbWqF1ApSSWw2L51W7dNCswNyKBfSgasAOXElKwbqd0SVDS/6nesmOY338vqhICVGUlltWWtnPJTeUtQEZuiwrBo58qEPRpkvld0U8ms79bAYp1wIKjoqQzGrFXaHHCubP9qAFZmJNXuiPgIBIKKWMDc+m18ParHjpgt69vcqh1vWyezvrdSjbNpbUFV5VrfdoURb5/MhnOQlkat79m2TpCOXEoPBZUh29VkvC6jpCP4KLC0zR06bGR1JTQQCiqiYch2davshnMQ3wQsOjkF+VrWdzo9OaiNLF1fA1KgqjZjxHa1W8V25RfTs74rBlXAsHcgO47br1Gz99KgItsVmtYx3xPnsyoXzo04c+mIglFLKahCsJzy06gOv91UVxpUnlIqPI/vs5oK2q5qu/K3G9X6DoNuP60R/XSye7MaiAQqsl3B0q0/0mjYrvzi14AVGlQBQJFLzhZ//ezevAYigYqar7oD6z6BidkywRKy4tKDBMKELkV52jccWYTXrtdTHpWRpZeV09PAGCc9WVLe9MXZf8iWb10OW0AV1tdpr3ptLWv6UuFlchibdQuic86PRB6pqBF6tKf1SfQGG2vIB0s01squ3deAEqhILD5+Am04n9ERMUqwhE47Wd14NaAMqlqYs/6ivfoSpXilzlqzqgFlUBFXtVOENW1XtGj33oFjVdCMeHwa0AIVsYkD6mMPlohPPVlLKhrQBhUdckY2IJXGG+uoBEs01s+u3dGANqhIlKoNSNd2xZSCJdxRZWdxgj3S6aoSGQFVtXEjG84P6vhdqSohq9esATyZT29OlUsxBipvw5nedaL1EVPx4mkDT5RaTHR95T1/P9CrrAQhjhkDlceEIH90vWAJHL1IbzOfryxUVlFbA1qHC3P2jlFQuRAsoa3RjAC9cn2KshrwHmqjoCJGXAiWUFZIVtHTAEA1V1UVAJR5UFWZMRIs8WCUgz5UlZDVa9YAXnS5oDlVLoVctY2PVNS0oWCJXtiupE7nkxM3KyWjgTsKxal48lNa08Je+Sq5alsBFTFvyHalHSwho8iszKgGhgW/fvQu6lX1QGJroKqyY8R2ZSRYIqp6ure8WKYqO7yCj1Bdq6ByLVhCVVndUo+mPsga+Qioun4QNPw9urYKKq8xx4Il6grIvps1MCzYzc2psin8TPUIohhA5WKwhKyauq8cX60qM0apI/W69kcqtORisERdAdl3VQPwSb8VjkzTVPWB9dTBet1YQOU1JvT39MC41Jsl6sJl35E0oDxKoZWzcNgcOR0oNlBlwRKROjjWwmsLpRswSs1WbRRuMiOjFNGIDVTUWBYsQVpw8COExgIdcPQdJRArqLJgCfcARVth2Otbos4ZP+k/SiBWUBHjWbCEevfZqImnNl3/tUE/X7GDihjIgiX83ZDMvXesE2cr1VvnZzBINEVTJQKqLFhCvRtN1tQ/1kk0jVLEXyKgooYNbThnwRKkTOWPurGTmsTBJy3P+koMVFU9GNlwzoIlFECla+zEI9+expdxN7KQKKiyYInGroj9WsfYCUwFn4+fKKg8NZoKlsgXb4y9W1LaoAFj5wFaFweJnziojAVLZAd9BPVxc7qmsZNx/lAz0dEUpUPPRqubuzLxVlQMyUurm9fm+Oo0SmTshJv2C+pykbHTO3Y8kETiI9UoZ1mwxKgu7F3ZMHb6uXUGVFmwhL9rzN/bMnb6OXUGVMSYIdsVgiWivxXVr5hOvLdl7PTryilQVZkzYrtSeiuqXzmdd2/H2OnXk3OgItsV4sd2+BmNdi+m6f8qo7Xoemmbxk6/7M6BihisvhXVnTdL+JWW0ntrxk6/PpwEVRYs4e8mvXvbxk4/d06Cipg0FSyh81ZUv7JSe2/Z2OnXi7Og8hg1ECwBu4zWW1H9CkvbvQnPzp3F/HejyO00qChYAsKsjyJQi7KTeY517UEfcRg7/Tp3ZpvGz1j9ngx2lQvnX8LyXTkmrUqrGudfp9s93yrvl6lrx/Ps/Hj9TvZb/WxH2RY0y5HPDh6HyY/6MT1SOsrVazm9tVt7dobJ4/T0V2feTLBEnVr2LauBIM/OsPqpABUJUQuWGA4TKMs3pIE2np1hLaQGVOQUBteWW8IEyvLNaKCdZ2dYC6kBFQlixnYVppIsH2HsbT07wzSUKlBVhTGy4Ryml+7OD/HsDFNO6kBlJlgiTC3dnM9PRjV2+rWVOlB5ApgIlvBrIruva6BlgGg9U+bbeeNnkBBVRzyhabsKot6t6WrGTr+20jlSQYqa7WrkoC2/YNm9kgY2K9XyVUotqKpy6AdL+PTRxbdelEzTYRsqCkk1qChYgsKyVATP6ozRwDCsy7pHCo0QTDWoSIqa7epzOKfvzIhU2UUEDeCNsoItrHmERKgXXDS1C/VWImHxvhi/uPmIoJ3TKj9La9CAEEM8x7+naz5ooDhy+f+YE7lt0WnqqwAAAABJRU5ErkJggg==' />
      </pattern>
    </defs>
    <g id='Сгруппировать_2500' data-name='Сгруппировать 2500' transform='translate(-494.751 786.003)'>
      <g id='Вычитание_11' data-name='Вычитание 11' transform='translate(494.751 -786.003)' fill='#fff'>
        <path d='M3.709,19.5H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H12.5a2,2,0,0,1,2,2V14.468L13.374,13.7V2.125a1,1,0,0,0-1-1H2.124a1,1,0,0,0-1,1v15.25a1,1,0,0,0,1,1h.849L3.708,19.5Z' stroke='none' />
        <path d='M 3.708900213241577 19.50030136108398 L 3.70710015296936 19.50030136108398 L 1.999800086021423 19.50030136108398 C 0.8971101641654968 19.50030136108398 1.403808624900194e-07 18.60319137573242 1.403808624900194e-07 17.50050163269043 L 1.403808624900194e-07 1.999800682067871 C 1.403808624900194e-07 0.8971107006072998 0.8971101641654968 6.805419729971618e-07 1.999800086021423 6.805419729971618e-07 L 12.49830055236816 6.805419729971618e-07 C 13.60099029541016 6.805419729971618e-07 14.49810028076172 0.8971107006072998 14.49810028076172 1.999800682067871 L 14.49810028076172 14.46750068664551 L 13.37400054931641 13.7003002166748 L 13.37400054931641 2.124900579452515 C 13.37400054931641 1.573550701141357 12.92545032501221 1.125000715255737 12.37409973144531 1.125000715255737 L 2.124000072479248 1.125000715255737 C 1.572650194168091 1.125000715255737 1.124100089073181 1.573550701141357 1.124100089073181 2.124900579452515 L 1.124100089073181 17.37540054321289 C 1.124100089073181 17.92675018310547 1.572650194168091 18.37530136108398 2.124000072479248 18.37530136108398 L 2.972690105438232 18.37530136108398 L 3.708000183105469 19.49850082397461 L 3.708900213241577 19.50030136108398 Z' stroke='none' fill={fill || '#69767a'} />
      </g>
      <rect id='Изображение_6' data-name='Изображение 6' width='12' height='16' transform='translate(497 -780)' fill='url(#pattern)' />
    </g>
  </SvgIcon>
);
