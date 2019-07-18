function replace_address {
  FROM=$1;shift;
  TO=$1;shift;
  FILES=$( grep ${FROM} node_modules -RFl );

  for FILENAME in ${FILES}; do
    echo sed -i.bk "s/${FROM}/${TO}/g" "${FILENAME}";
    sed -i.bk "s/${FROM}/${TO}/g" "${FILENAME}";
  done;
}

# ERC20Proxy
replace_address '0x2240dab907db71e64d3e0dba4800c83b5c502d4e' '0x95e6f48254609a6ee006f7d493c8e5fb97094cef';

# ERC721Proxy
replace_address '0x208e41fb445f1bb1b6780d58356e81405f3e6127' '0xefc70a1b18c432bdc64b596838b4d138f6bc6cad';

# MAP
# replace_address '' '0xef701d5389ae74503d633396c4d654eabedc9d78';

# Exchange
replace_address '0x4f833a24e1f95d70f028921e27040ca56e09ab0b' '0x080bf510fcbf18b91105470639e9561022937712';

# APOwner
replace_address '0x17992e4ffb22730138e4b62aaa6367fa9d3699a6' '0xdffe798c7172dd6deb32baee68af322e8f495ce0';

# Forwarder
replace_address '0x7afc2d5107af94c462a194d2c21b5bdd238709d6' '0x76481caa104b5f6bccb540dae4cefaf1c398ebea';

# OrderValidator
replace_address '0x9463e518dea6810309563c81d5266c1b1d149138' '0xa09329c6003c9a5402102e226417738ee22cf1f2';
