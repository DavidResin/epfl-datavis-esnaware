# Script to generate test nodes and links

import itertools, json, random
from random import sample
from string import ascii_uppercase

n, l = 60, 200

def iter_all_strings():
	for size in itertools.count(1):
		for s in itertools.product(ascii_uppercase, repeat=size):
			yield "".join(s)

names = [s for s in itertools.islice(iter_all_strings(), n)]
links = sample([{"source" : a, "target" : b, "type" : sample(["cc", "ps"], 1)[0]} for a in names for b in names if a < b], l)

d, e = dict(), dict()

for x in links:
	d[x["source"]] = d[x["source"]] + [x["target"]] if d.get(x["source"]) else [x["target"]]

nodes = [{"id" : n} for n in names]

for i, k in enumerate(links):
	k["id"] = str(i)

with open("data.json", "w") as f:
	json.dump({"nodes" : nodes, "links" : links}, f, indent="\t")
