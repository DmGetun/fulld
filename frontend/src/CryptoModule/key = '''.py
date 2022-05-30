key = '''
MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAuVltdt5+CVCiMyQQ
0iS9qNPa7u7ItHkjPFkLV+RRxQYH0hdC/oNOV8yqXBP13o9MWbMsZ4e+qBVVAWw4
H9ZZyQIDAQABAkEAoabzJ4cpGWqv7DZ6TS0qFMKg4V50waIdLxbiI8fH4TLBoxcW
9yrxloxf0ubu9f4867VlDiQZV+I9DKA4J8Xy4QIhAO8tplrIo3KPlIv0FSrbhNp1
o1gGveqOVzO48yO0GyD1AiEAxmKZZ3z7AXXM3hEco/PVlz6RepbDCnt9fNN/pGfe
wQUCIBpLdX+DkVyV5mnggrc8fQWba0LRMu3nijS4f5qMQXNFAiEAps6HEFYtM8ga
L2qR+2Vt5dMNPdeAPdMh65BmVhWkXgUCIQDnYtj75zwjxMCrlD5NzRayvCzBj0bq
i1e4V+Lli/pG5A==
'''

print(int.from_bytes(str.encode(key),'big'))
import os 
encoded = str.encode(key)
print(os.urandom(32).decode('utf-8'))