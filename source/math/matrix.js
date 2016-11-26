import {map} from 'lodash';

export function multiply(m,v){
	return m.map((p,i)=> p * v[i%4])
		.reduce((sum, p, i)=>{ 
			sum[Math.floor(i/4)] += p
			return sum
		},[0,0,0,0])
}