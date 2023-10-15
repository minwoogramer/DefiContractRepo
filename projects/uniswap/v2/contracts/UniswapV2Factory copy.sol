// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';

// UniswapV2Factory 컨트랙트 구현
contract UniswapV2Factory is IUniswapV2Factory {
    // 수수료를 받을 주소와 설정자 주소
    address public override feeTo;
    address public override feeToSetter;

    // 토큰 쌍에 대한 주소를 저장하는 매핑
    mapping(address => mapping(address => address)) public override getPair;
    // 모든 토큰 쌍의 주소를 저장하는 배열
    address[] public override allPairs;

    // 토큰 쌍이 생성될 때 발생하는 이벤트
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    // 생성자 함수: feeToSetter 주소를 초기화
    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    // 현재까지 생성된 모든 토큰 쌍의 수를 반환
    function allPairsLength() external view override returns (uint) {
        return allPairs.length;
    }

    // 새로운 토큰 쌍을 생성하는 함수
    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        // 동일한 토큰으로 페어를 생성할 수 없음
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        
        // 토큰을 정렬 (작은 주소가 token0이 됨)
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        
        // 제로 주소를 사용할 수 없음
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        
        // 토큰 쌍이 이미 존재하지 않아야 함
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        
        // 새 페어 컨트랙트를 배포
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        
        // 페어 컨트랙트를 초기화
        IUniswapV2Pair(pair).initialize(token0, token1);
        
        // 토큰 쌍 주소를 매핑에 저장
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // reverse direction
        
        // 토큰 쌍 주소를 배열에 추가
        allPairs.push(pair);
        
        // 토큰 쌍 생성 이벤트 발생
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    // 수수료 주소를 설정하는 함수
    function setFeeTo(address _feeTo) external override {
        // 오직 feeToSetter만이 이 함수를 호출할 수 있음
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    // feeToSetter 주소를 변경하는 함수
    function setFeeToSetter(address _feeToSetter) external override {
        // 오직 feeToSetter만이 이 함수를 호출할 수 있음
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}
